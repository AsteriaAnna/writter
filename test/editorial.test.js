import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validatePlan,createWorkflowRunner} from '../src/ai.js';
import {completeTask,upgrade,afterManualChange} from '../src/workflow.js';
import {createProject,applyProjectAction} from '../src/domain.js';
const documents=[{id:'s',url:'https://example.com/',text:'中心已启用，希望实现云端监测。'}];
const value={plan:{title:'投入之后，怎样判断合作效果？',angle:'写给关注民生项目的读者',readerQuestion:'项目启用是否意味着目标已实现？',thesis:'投入与效果需要分开判断',readerTakeaway:'能区分实际投入与尚待验证的目标',outline:[{title:'从启用消息提出问题',purpose:'呈现读者容易混淆的判断',keyPoint:'启用是事实，监测效果仍是目标',evidence:['s'],transition:'接着解释需要什么效果证据'},{title:'回到判断标准',purpose:'回应开篇问题',keyPoint:'不要将投入直接称为效果',evidence:['s'],transition:'以投入与效果的区别收束'}]},claims:[{text:'中心启用，云端监测是目标',sourceId:'s',quote:'中心已启用，希望实现云端监测。'}],warnings:[]};
test('AI planning stores a readable question, thesis, section purpose and transitions in existing editable fields',()=>{
 const result=validatePlan(value,documents,{requireLogic:true});
 assert.match(result.plan.angle,/核心问题：.*目标已实现/);assert.match(result.plan.angle,/中心判断：投入与效果/);
 assert.match(result.plan.outline,/段落作用：/);assert.match(result.plan.outline,/承接：/);
 assert.throws(()=>validatePlan({...value,plan:{...value.plan,thesis:''}},documents,{requireLogic:true}),/中心判断/);
 assert.throws(()=>validatePlan({...value,plan:{...value.plan,outline:[{...value.plan.outline[0],evidence:['invented']},value.plan.outline[1]]}},documents,{requireLogic:true}),/来源/);
});
const project={plan:{title:'投入与效果',angle:'区分投入与效果',outline:'提问→区分→收束'},draft:{markdown:'中心启用就证明科技自立自强。'},workflow:{documents,claims:value.claims,approval:{plan:{title:'投入与效果',angle:'区分投入与效果',outline:'提问→区分→收束'},documents,claims:value.claims}}};
const audit={review:{facts:'revise',structure:'revise',writing:'pass',summary:'中心论点超出来源，正文也未兑现确认的问题。'},issues:[{severity:'blocking',category:'facts',text:'启用不能证明自主创新，目标不能当成果',quote:project.draft.markdown,suggestion:'删除自主创新判断，保留启用与目标的区别'},{severity:'blocking',category:'structure',text:'正文没有回答投入与效果的区别',quote:project.draft.markdown,suggestion:'按已确认的问题展开并回应开篇'}]};
test('review receives the confirmed argument and rejects empty or contradictory dimension verdicts',async()=>{
 let response=audit,captured;
 const run=createWorkflowRunner({ai:{configured:true,json:async(system,input)=>{captured={system,input};return response;}}});
 const result=await run(project,'audit');assert.equal(result.review.structure,'revise');assert.equal(result.issues[0].suggestion,audit.issues[0].suggestion);
 assert.equal(captured.input.plan,project.workflow.approval.plan);
 assert.match(captured.system,/目标是否改写为成果/);assert.match(captured.system,/单独判断 structure 和 writing/);
 response={...audit,issues:[]};await assert.rejects(run(project,'audit'),/结论与具体问题/);
 response={...audit,review:{...audit.review,facts:'pass'}};await assert.rejects(run(project,'audit'),/结论与具体问题/);
 response={...audit,issues:[{...audit.issues[0],quote:'正文不存在'},audit.issues[1]]};await assert.rejects(run(project,'audit'),/定位/);
});
test('natural language revision receives the current draft and review while keeping the approved brief',async()=>{
 let received;
 const run=createWorkflowRunner({ai:{configured:true,json:async(system,input)=>{received=input;return {markdown:'中心已启用；云端监测仍是希望实现的目标。',visuals:[]};}}});
 const p={...project,workflow:{...project.workflow,audit}};
 await run(p,'draft',{instruction:'删去空泛升华，说明投入与效果的区别'});
 assert.equal(received.currentMarkdown,p.draft.markdown);assert.equal(received.review,audit);assert.equal(received.plan,p.workflow.approval.plan);
 assert.match(received.revisionInstruction,/删去空泛升华/);
});
test('structure blocking issues stop publication and revising the draft invalidates all review dimensions',()=>{
 let p=upgrade(createProject({title:'投入与效果'}));
 p.plan=project.plan;p.evidence={sources:[documents[0].url],notes:'来源',confirmed:true};p.workflow.documents=documents;
 p=afterManualChange(p,applyProjectAction(p,'approve_plan',{plan:p.plan,evidence:p.evidence}),'approve_plan');
 p.workflow.task={kind:'draft'};p=completeTask(p,{markdown:project.draft.markdown,visuals:[]});
 p.workflow.task={kind:'audit'};p=completeTask(p,audit);
 assert.equal(p.workflow.audit.review.structure,'revise');
 assert.throws(()=>afterManualChange(p,applyProjectAction(p,'render',{markdown:p.draft.markdown,audited:true}),'render'),/文章主线/);
 const next=afterManualChange(p,applyProjectAction(p,'save_draft',{markdown:'投入不能等同效果。'}),'save_draft');
 assert.equal(next.workflow.audit,null);assert.equal(next.stale.render,true);
});
