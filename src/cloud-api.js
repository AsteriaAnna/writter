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
export function makeHandler({db,getIdentity,allowedUids,loadFeed}) {
  return async function handle(event={}) {
    try {
      const identity=await getIdentity();
      if(!identity?.uid||identity.isAnonymous)fail('UNAUTHENTICATED','请使用账号登录');
      const uid=identity.uid;
      if(event.action==='whoami')return {ok:true,data:{uid,authorized:allowedUids.includes(uid)}};
      if(!allowedUids.includes(uid))fail('FORBIDDEN','账号尚未获得工作台权限，请在云函数中配置允许的 UID');
      if(event.action==='feed')return {ok:true,data:await loadFeed(event.window || '24h')};
      if(event.action==='projects.list') {
        const offset=event.offset ?? 0;
        if(!Number.isInteger(offset)||offset<0||offset>10000)fail('INVALID_INPUT','无效分页');
        const result=await db.collection('projects').where({ownerId:uid}).skip(offset).limit(100).get();
        return {ok:true,data:{items:result.data.map(p=>({id:p.id,stage:p.stage,revision:p.revision,updatedAt:p.updatedAt,plan:{title:p.plan.title},partial:true})),nextOffset:result.data.length===100?offset+100:null}};
      }
      if(event.action==='projects.get') {
        const id=text(event.id,64,true);
        if(!/^[a-f0-9]{64}$/.test(id))fail('INVALID_INPUT','无效项目');
        const result=await db.collection('projects').doc(id).get();
        const p=Array.isArray(result.data)?result.data[0]:result.data;
        if(!p||p.ownerId!==uid)fail('NOT_FOUND','项目不存在或不可访问');
        return {ok:true,data:publicProject(p)};
      }
      if(event.action==='projects.create') {
        const candidate=validateCandidate(event.candidate),id=projectId(uid,candidate);
        const tx=await db.startTransaction();
        try {
          const ref=db.collection('projects').doc(id),old=(await tx.get(ref)).data();
          if(old){if(old.ownerId!==uid)fail('FORBIDDEN','项目不可访问');await tx.commit();return {ok:true,data:publicProject(old)};}
          const project={...createProject(candidate,id),ownerId:uid,schemaVersion:1};
          await tx.set(ref,project);await tx.commit();return {ok:true,data:publicProject(project)};
        }catch(err){await tx.rollback().catch(()=>{});throw err;}
      }
      if(event.action==='projects.mutate') {
        const id=text(event.id,64,true);
        if(!/^[a-f0-9]{64}$/.test(id)||!Number.isInteger(event.expectedRevision)||event.expectedRevision<0)fail('INVALID_INPUT','无效项目或版本');
        const payload=validateMutation(event.command,event.payload);
        const tx=await db.startTransaction();
        try {
          const ref=db.collection('projects').doc(id),old=(await tx.get(ref)).data();
          if(!old||old.ownerId!==uid)fail('NOT_FOUND','项目不存在或不可访问');
          if(old.revision!==event.expectedRevision)fail('CONFLICT','此项目已在另一页面或设备更新。当前输入仍保留，请复制后重新读取云端。');
          const {_id,...stored}=old;
          const next=applyProjectAction(stored,event.command,payload);
          await tx.set(ref,next);await tx.commit();return {ok:true,data:publicProject(next)};
        }catch(err){await tx.rollback().catch(()=>{});throw err;}
      }
      fail('INVALID_INPUT','未知请求');
    } catch(err) {
      const known=['INVALID_INPUT','UNAUTHENTICATED','FORBIDDEN','NOT_FOUND','CONFLICT'];
      // Domain validation errors are safe; infrastructure details stay in logs.
      if(known.includes(err.code))return {ok:false,error:{code:err.code,message:err.message}};
      if(['请先','请填写','策划已过期','没有可恢复','未知操作'].some(x=>err.message?.startsWith(x)))return {ok:false,error:{code:'INVALID_STATE',message:err.message}};
      console.error('Writter request failed',err.code || err.name);
      return {ok:false,error:{code:'SERVICE_ERROR',message:'云端操作失败。请检查云函数日志、数据库集合及网络连接。'}};
    }
  };
}
