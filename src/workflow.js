import {renderArticle} from './domain.js';
export const taskKinds=['analyze','adjust','draft','audit'];
export function upgrade(project){
 const p=structuredClone(project);p.schemaVersion=2;
 p.workflow ||= {documents:[],claims:[],warnings:[],approval:null,audit:null,task:null};
 p.workflow.documents ||= [];p.workflow.claims ||= [];p.workflow.warnings ||= [];
 return p;
}
export function startTask(project,kind,id,now=Date.now()){
 const p=upgrade(project);
 if(!taskKinds.includes(kind))throw Error('未知任务');
 const t=p.workflow.task;
 if(t&&['pending','running'].includes(t.status)&&now<t.expiresAt)throw Error('当前任务仍在处理中');
 if(kind==='adjust'&&(!p.plan.angle||!p.workflow.documents.length))throw Error('请先完成检测与策划');
 if(kind==='draft'&&(!p.workflow.approval||p.stale.draft&&p.stage!=='plan_ready'))throw Error('请先确认当前策划');
 if(kind==='audit'&&(p.stale.draft||!p.draft.markdown.trim()))throw Error('请先生成或保存当前正文');
 p.revision++;p.updatedAt=new Date(now).toISOString();
 p.workflow.task={id,kind,status:'pending',baseRevision:p.revision,createdAt:now,expiresAt:now+180000};
 return p;
}
export function completeTask(project,result){
 const p=upgrade(project),kind=p.workflow.task.kind;
 if(['analyze','adjust'].includes(kind)){
  p.history.plan=[...p.history.plan,structuredClone(p.plan)].slice(-3);
  p.plan=result.plan;p.workflow.documents=result.documents;p.workflow.claims=result.claims;p.workflow.warnings=result.warnings;
  p.evidence={sources:result.documents.map(x=>x.url),notes:result.claims.map(x=>x.text+' — '+x.quote).join('\n'),confirmed:false};
  p.workflow.approval=null;p.workflow.audit=null;p.stale={draft:true,visual:true,render:true};p.stage='planning';
 }else if(kind==='draft'){
  p.history.draft=[...p.history.draft,structuredClone(p.draft)].slice(-3);
  p.draft={markdown:result.markdown};p.visual={assets:[],suggestions:result.visuals};p.workflow.audit=null;p.stale={draft:false,visual:true,render:true};p.stage='draft_ready';
 }else{
  p.workflow.audit={issues:result.issues,...(result.review?{review:result.review}:{}),checkedMarkdown:p.draft.markdown,checkedAt:new Date().toISOString()};p.stale.render=true;
 }
 p.workflow.task={...p.workflow.task,status:'succeeded',finishedAt:Date.now()};p.revision++;p.updatedAt=new Date().toISOString();return p;
}
export function afterManualChange(before,after,action){
 const p=upgrade(after),old=upgrade(before);
 p.workflow=old.workflow;
 if(['save_plan','approve_plan','restore_plan'].includes(action)){
  const changed=JSON.stringify(before.plan)!==JSON.stringify(after.plan)||JSON.stringify(before.evidence)!==JSON.stringify(after.evidence);
  if(changed){p.workflow.approval=null;p.workflow.audit=null;}
  if(action==='approve_plan'){
   if(!p.workflow.documents.length)throw Error('请先完成来源检测，再确认策划');
   p.workflow.approval={plan:structuredClone(p.plan),documents:structuredClone(p.workflow.documents),claims:structuredClone(p.workflow.claims),confirmedAt:new Date().toISOString()};
  }
 }
 if(['save_draft','restore_draft'].includes(action)&&before.draft.markdown!==after.draft.markdown)p.workflow.audit=null;
 if(action==='render'){
  if(!p.workflow.audit||p.workflow.audit.checkedMarkdown!==p.draft.markdown)throw Error('请先复查当前正文');
  if(p.workflow.audit.issues.some(x=>x.severity==='blocking'))throw Error('请先修正复查发现的事实或文章主线问题');
  p.output={html:renderArticle(p.plan.title,p.draft.markdown),template:'editorial-basic-v1'};
 }
 return p;
}
