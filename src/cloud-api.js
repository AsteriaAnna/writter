import {randomUUID} from 'node:crypto';
import {upgrade,startTask,completeTask,afterManualChange,taskKinds} from './workflow.js';
import {createHash} from 'node:crypto';
import {createProject,applyProjectAction,safeUrl} from './domain.js';
const fail=(code,message)=>{throw Object.assign(new Error(message),{code});};
const text=(value,max,required=false)=>{if(typeof value!=='string'||value.length>max||(required&&!value.trim()))fail('INVALID_INPUT','字段格式或长度不正确');return value;};
export function validateCandidate(x) {
  if(!x || !['manual','ai-news-aggregator','aihot'].includes(x.provider))fail('INVALID_INPUT','无效来源');
  const raw=text(x.originalUrl || '',2048);
  if(raw&&!safeUrl(raw))fail('INVALID_INPUT','无效来源链接');
  return {provider:x.provider,externalId:text(x.externalId,200,true),title:text(x.title,500,true),summary:text(x.summary || '',5000),originalUrl:safeUrl(raw),sourceName:text(x.sourceName || '手动添加',200),publishedAt:text(x.publishedAt || '',100),category:text(x.category || 'manual',100)};
}
function validateMutation(action,payload) {
  if(!payload || typeof payload!=='object')fail('INVALID_INPUT','无效内容');
  if(['save_plan','approve_plan'].includes(action)) {
    const {plan,evidence}=payload;
    if(!plan||!evidence||!Array.isArray(evidence.sources)||evidence.sources.length>30||typeof evidence.confirmed!=='boolean')fail('INVALID_INPUT','无效策划或来源');
    for(const x of evidence.sources)if(!safeUrl(text(x,2048)))fail('INVALID_INPUT','无效来源链接');
    return {plan:{title:text(plan.title,500,true),angle:text(plan.angle,20000),outline:text(plan.outline,40000)},evidence:{sources:evidence.sources.map(safeUrl),notes:text(evidence.notes,100000),confirmed:evidence.confirmed}};
  }
  if(['save_draft','render'].includes(action))return {markdown:text(payload.markdown,200000,true),audited:payload.audited===true};
  if(['restore_plan','restore_draft'].includes(action))return {};
  fail('INVALID_INPUT','未知操作');
}

const publicProject=p=>{const {_id,ownerId,...rest}=p;return rest;};
export function projectId(uid,candidate){return createHash('sha256').update(JSON.stringify([uid,candidate.provider,candidate.externalId])).digest('hex');}
// Auth identity is supplied by trusted SDK context, never by event.ownerId/uid.
export function makeHandler({repo,getIdentity,allowedUids,loadFeed,runWorkflow,aiConfigured=false}) {
  return async function handle(event={}) {
    try {
      const identity=await getIdentity();
      if(!identity?.uid||identity.isAnonymous)fail('UNAUTHENTICATED','请使用账号登录');
      const uid=identity.uid;
      if(event.action==='whoami')return {ok:true,data:{uid,authorized:allowedUids.includes(uid)}};
      if(!allowedUids.includes(uid))fail('FORBIDDEN','账号尚未获得工作台权限，请在云函数中配置允许的 UID');
      if(event.action==='capabilities')return {ok:true,data:{ai:aiConfigured,sourceReading:!!runWorkflow,template:'editorial-basic-v1'}};
      if(event.action==='feed')return {ok:true,data:await loadFeed(event.window || '24h')};
      if(event.action==='projects.list') {
        const offset=event.offset ?? 0;
        if(!Number.isInteger(offset)||offset<0||offset>10000)fail('INVALID_INPUT','无效分页');
        const {items,nextOffset}=await repo.list(uid,offset);
        return {ok:true,data:{items,nextOffset}};
      }
      if(event.action==='projects.get') {
        const id=text(event.id,64,true);
        if(!/^[a-f0-9]{64}$/.test(id))fail('INVALID_INPUT','无效项目');
        const p=await repo.get(id);
        if(!p||p.ownerId!==uid)fail('NOT_FOUND','项目不存在或不可访问');
        return {ok:true,data:publicProject(upgrade(p))};
      }
      if(event.action==='projects.create') {
        const candidate=validateCandidate(event.candidate),id=projectId(uid,candidate);
        const project={...upgrade(createProject(candidate,id))};
        const saved=await repo.create(uid,id,project);
        if(saved.ownerId!==uid)fail('FORBIDDEN','项目不可访问');
        return {ok:true,data:publicProject(saved)};
      }
      if(['tasks.start','tasks.run'].includes(event.action)) {
        const id=text(event.id,64,true);
        if(!/^[a-f0-9]{64}$/.test(id))fail('INVALID_INPUT','无效项目');
        const old=await repo.get(id);
        if(!old||old.ownerId!==uid)fail('NOT_FOUND','项目不存在或不可访问');
        if(!runWorkflow||!aiConfigured)fail('AI_NOT_CONFIGURED','AI 服务尚未配置，请设置云端模型密钥');
        let p=upgrade(old);delete p.ownerId;
        if(event.action==='tasks.start') {
          if(old.revision!==event.expectedRevision)fail('CONFLICT','项目已更新，请重新读取后重试');
          if(!taskKinds.includes(event.kind))fail('INVALID_INPUT','未知任务');
          const input={};
          if(event.kind==='analyze') {
            if(event.input?.urls&&!Array.isArray(event.input.urls))fail('INVALID_INPUT','来源格式错误');
            input.urls=(event.input?.urls||[]).slice(0,4).map(x=>{if(!safeUrl(text(x,2048)))fail('INVALID_INPUT','来源链接错误');return x;});
          }
          if(event.kind==='adjust')input.instruction=text(event.input?.instruction,4000,true);
          if(event.kind==='draft'&&event.input?.instruction!==undefined){
            input.instruction=text(event.input.instruction,4000,true);
            if(!p.draft.markdown.trim())fail('INVALID_STATE','请先生成正文，再提出修改意见');
          }
          try{p=startTask(p,event.kind,randomUUID());}catch(err){fail('INVALID_STATE',err.message);}
          p.workflow.task.input=input;
          const saved=await repo.mutate(id,uid,old.revision,p);
          if(!saved)fail('CONFLICT','项目已更新，请重新读取后重试');
          return {ok:true,data:publicProject(saved)};
        }
        const task=p.workflow.task;
        if(!task||task.id!==event.taskId)fail('CONFLICT','任务已被替换，请读取最新项目');
        if(task.status!=='pending')return {ok:true,data:publicProject(p)};
        if(Date.now()>task.expiresAt)fail('TASK_EXPIRED','任务已过期，请重新发起');
        if(p.revision!==task.baseRevision){
          p.revision++;p.workflow.task={...task,status:'superseded',message:'内容已修改，请基于当前版本重新发起任务'};
          const marked=await repo.mutate(id,uid,old.revision,p);
          return {ok:true,data:publicProject(marked||await repo.get(id))};
        }
        p.revision++;p.workflow.task={...task,status:'running',baseRevision:p.revision,expiresAt:Date.now()+150000};
        p.updatedAt=new Date().toISOString();
        const claimed=await repo.mutate(id,uid,old.revision,p);
        if(!claimed){const latest=await repo.get(id);return {ok:true,data:publicProject(latest)};}
        let next;
        try{next=completeTask(p,await runWorkflow(p,task.kind,task.input));}
        catch(err){next=structuredClone(p);next.revision++;next.workflow.task={...p.workflow.task,status:'failed',message:err.message,finishedAt:Date.now()};next.updatedAt=new Date().toISOString();}
        const saved=await repo.mutate(id,uid,p.revision,next);
        if(saved)return {ok:true,data:publicProject(saved)};
        const latest=await repo.get(id);
        if(latest?.ownerId!==uid)fail('NOT_FOUND','项目不可访问');
        if(latest.workflow?.task?.id===task.id){
          const superseded=upgrade(latest);delete superseded.ownerId;superseded.revision++;
          superseded.workflow.task={...superseded.workflow.task,status:'superseded',message:'内容已修改，本次结果未覆盖新版本'};
          const marked=await repo.mutate(id,uid,latest.revision,superseded);
          return {ok:true,data:publicProject(marked||await repo.get(id))};
        }
        return {ok:true,data:publicProject(latest)};
      }
      if(event.action==='projects.mutate') {
        const id=text(event.id,64,true);
        if(!/^[a-f0-9]{64}$/.test(id)||!Number.isInteger(event.expectedRevision)||event.expectedRevision<0)fail('INVALID_INPUT','无效项目或版本');
        const payload=validateMutation(event.command,event.payload);
        const old=await repo.get(id);
        if(!old||old.ownerId!==uid)fail('NOT_FOUND','项目不存在或不可访问');
        if(old.revision!==event.expectedRevision)fail('CONFLICT','此项目已在另一页面或设备更新。当前输入仍保留，请复制后重新读取云端。');
        const {ownerId,...stored}=old;
        let next;try{next=afterManualChange(stored,applyProjectAction(stored,event.command,payload),event.command);}catch(err){fail('INVALID_STATE',err.message);}
        const saved=await repo.mutate(id,uid,event.expectedRevision,next);
        if(!saved)fail('CONFLICT','此项目已在另一页面或设备更新。当前输入仍保留，请复制后重新读取云端。');
        return {ok:true,data:publicProject(saved)};
      }
      fail('INVALID_INPUT','未知请求');
    } catch(err) {
      const known=['INVALID_INPUT','UNAUTHENTICATED','FORBIDDEN','NOT_FOUND','CONFLICT','INVALID_STATE','AI_NOT_CONFIGURED','TASK_EXPIRED'];
      // Domain validation errors are safe; infrastructure details stay in logs.
      if(known.includes(err.code))return {ok:false,error:{code:err.code,message:err.message}};
      if(['请先','请填写','策划已过期','没有可恢复','未知操作'].some(x=>err.message?.startsWith(x)))return {ok:false,error:{code:'INVALID_STATE',message:err.message}};
      console.error('Writter request failed',err.code || err.name);
      return {ok:false,error:{code:'SERVICE_ERROR',message:'云端操作失败。请检查云函数日志、数据库集合及网络连接。'}};
    }
  };
}
