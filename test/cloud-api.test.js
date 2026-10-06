import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeHandler,projectId} from '../src/cloud-api.js';
import {applyProjectAction,createProject} from '../src/domain.js';
const candidate={provider:'manual',externalId:'manual-1',title:'Test',originalUrl:'https://example.com',sourceName:'Manual'};
const plan={title:'Title',angle:'Angle',outline:'Outline'};
const evidence={sources:['https://example.com'],notes:'Evidence',confirmed:true};
function setup(extra={}){
 const records=new Map();let identity={uid:'owner-a',isAnonymous:false};
 const repo={
  async list(uid,offset){const items=[...records.values()].filter(r=>r.ownerId===uid).slice(offset,offset+100).map(r=>({id:r.id,stage:r.stage,revision:r.revision,updatedAt:r.updatedAt,plan:{title:r.plan.title},partial:true}));return {items,nextOffset:items.length===100?offset+100:null};},
  async get(id){const r=records.get(id);return r?structuredClone(r):null;},
  async create(uid,id,project){const existing=records.get(id);if(existing)return structuredClone(existing);const r={ownerId:uid,...structuredClone(project)};records.set(id,r);return structuredClone(r);},
  async mutate(id,uid,expectedRevision,next){const r=records.get(id);if(!r||r.ownerId!==uid||r.revision!==expectedRevision)return null;const saved={ownerId:uid,...structuredClone(next)};records.set(id,saved);return structuredClone(saved);},
 };
 const handler=makeHandler({repo,getIdentity:async()=>identity,allowedUids:['owner-a','owner-b'],loadFeed:async window=>({window,items:[]}),...extra});
 return {handler,records,setIdentity:v=>identity=v};
}
test('reject missing or anonymous identity, ignore caller supplied UID',async()=>{const f=setup();f.setIdentity({uid:'',isAnonymous:false});assert.equal((await f.handler({action:'projects.list',uid:'owner-a'})).error.code,'UNAUTHENTICATED');f.setIdentity({uid:'owner-a',isAnonymous:true});assert.equal((await f.handler({action:'feed'})).error.code,'UNAUTHENTICATED');});
test('allowlist is required for data operations while whoami supports deployment setup',async()=>{const f=setup();f.setIdentity({uid:'stranger',isAnonymous:false});assert.deepEqual((await f.handler({action:'whoami'})).data,{uid:'stranger',authorized:false});assert.equal((await f.handler({action:'projects.list'})).error.code,'FORBIDDEN');});
test('duplicate selection returns one project and IDs are scoped to owner',async()=>{const f=setup();const a=await f.handler({action:'projects.create',candidate});const b=await f.handler({action:'projects.create',candidate});assert.equal(a.data.id,b.data.id);assert.equal(f.records.size,1);assert.notEqual(projectId('owner-a',candidate),projectId('owner-b',candidate));assert.equal(a.data.ownerId,undefined);});
test('owner isolation applies to list and mutation',async()=>{const f=setup();const p=(await f.handler({action:'projects.create',candidate})).data;f.setIdentity({uid:'owner-b',isAnonymous:false});assert.equal((await f.handler({action:'projects.list'})).data.items.length,0);assert.equal((await f.handler({action:'projects.mutate',id:p.id,expectedRevision:0,command:'save_plan',payload:{plan,evidence},ownerId:'owner-a'})).error.code,'NOT_FOUND');});
test('approval, render, stale invalidation are enforced on server; client HTML is ignored',async()=>{const f=setup();let p=(await f.handler({action:'projects.create',candidate})).data;const mutate=async(command,payload)=>f.handler({action:'projects.mutate',id:p.id,expectedRevision:p.revision,command,payload});assert.equal((await mutate('render',{markdown:'Body',audited:true})).error.code,'INVALID_STATE');f.records.get(p.id).workflow.documents=[{id:'s',url:'https://example.com',text:'Evidence'}];p=(await mutate('approve_plan',{plan,evidence})).data;assert.equal(p.revision,1);f.records.get(p.id).workflow.audit={checkedMarkdown:'<script>alert(1)</script>',issues:[]};p=(await mutate('render',{markdown:'<script>alert(1)</script>',audited:true,html:'<script>bad</script>'})).data;assert.equal(p.stage,'preview_ready');assert.ok(!p.output.html.includes('<script>'));p=(await mutate('save_plan',{plan:{...plan,angle:'Changed'},evidence})).data;assert.equal(p.stale.render,true);assert.equal(p.stale.draft,true);});
test('stale revisions cannot overwrite data',async()=>{const f=setup();const p=(await f.handler({action:'projects.create',candidate})).data;const event={action:'projects.mutate',id:p.id,expectedRevision:0,command:'save_plan',payload:{plan,evidence}};assert.equal((await f.handler(event)).ok,true);assert.equal((await f.handler(event)).error.code,'CONFLICT');assert.equal(f.records.get(p.id).revision,1);});
test('candidate URLs and excessive payloads are rejected before writes',async()=>{const f=setup();assert.equal((await f.handler({action:'projects.create',candidate:{...candidate,originalUrl:'javascript:alert(1)'}})).error.code,'INVALID_INPUT');assert.equal((await f.handler({action:'projects.create',candidate:{...candidate,title:'x'.repeat(501)}})).error.code,'INVALID_INPUT');assert.equal(f.records.size,0);});
test('render requires explicit review and all transitions increment revisions',()=>{let p=createProject(candidate);p=applyProjectAction(p,'approve_plan',{plan,evidence});assert.equal(p.revision,1);assert.throws(()=>applyProjectAction(p,'render',{markdown:'Body',audited:false}));p=applyProjectAction(p,'render',{markdown:'Body',audited:true});assert.equal(p.revision,2);});
test('project lists contain lightweight summaries and full reads enforce ownership',async()=>{const f=setup();const p=(await f.handler({action:'projects.create',candidate})).data;const list=(await f.handler({action:'projects.list'})).data.items;assert.equal(list[0].partial,true);assert.equal(list[0].draft,undefined);assert.equal((await f.handler({action:'projects.get',id:p.id})).data.candidate.title,candidate.title);f.setIdentity({uid:'owner-b',isAnonymous:false});assert.equal((await f.handler({action:'projects.get',id:p.id})).error.code,'NOT_FOUND');});


const analysis={plan,documents:[{id:'s',url:'https://example.com/',text:'Evidence'}],claims:[{text:'Fact',quote:'Evidence',sourceId:'s'}],warnings:[]};
test('durable tasks run once and completed requests return the saved result',async()=>{
 let calls=0;const f=setup({aiConfigured:true,runWorkflow:async()=>{calls++;return analysis;}});
 let p=(await f.handler({action:'projects.create',candidate})).data;
 p=(await f.handler({action:'tasks.start',id:p.id,expectedRevision:p.revision,kind:'analyze'})).data;
 const event={action:'tasks.run',id:p.id,taskId:p.workflow.task.id};
 const a=await f.handler(event),b=await f.handler(event);
 assert.equal(a.data.workflow.task.status,'succeeded');assert.equal(b.data.revision,a.data.revision);assert.equal(calls,1);
});
test('a late AI result cannot overwrite a newer plan',async()=>{
 let release,entered;const waiting=new Promise(r=>entered=r),blocked=new Promise(r=>release=r);
 const f=setup({aiConfigured:true,runWorkflow:async()=>{entered();await blocked;return analysis;}});
 let p=(await f.handler({action:'projects.create',candidate})).data;
 p=(await f.handler({action:'tasks.start',id:p.id,expectedRevision:p.revision,kind:'analyze'})).data;
 const running=f.handler({action:'tasks.run',id:p.id,taskId:p.workflow.task.id});await waiting;
 const stored=f.records.get(p.id);
 const changed=await f.handler({action:'projects.mutate',id:p.id,expectedRevision:stored.revision,command:'save_plan',payload:{plan:{...plan,angle:'New angle'},evidence:{...evidence,confirmed:false}}});
 assert.equal(changed.ok,true);release();const result=await running;
 assert.equal(result.data.plan.angle,'New angle');assert.equal(result.data.workflow.task.status,'superseded');
});
test('unconfigured AI does not create tasks or pretend success',async()=>{
 const f=setup();const p=(await f.handler({action:'projects.create',candidate})).data;
 assert.equal((await f.handler({action:'tasks.start',id:p.id,expectedRevision:0,kind:'analyze'})).error.code,'AI_NOT_CONFIGURED');assert.equal(f.records.get(p.id).revision,0);
});
test('pending task becomes superseded if its input version changed before execution',async()=>{
 let calls=0;const f=setup({aiConfigured:true,runWorkflow:async()=>{calls++;return analysis;}});
 let p=(await f.handler({action:'projects.create',candidate})).data;
 p=(await f.handler({action:'tasks.start',id:p.id,expectedRevision:0,kind:'analyze'})).data;
 await f.handler({action:'projects.mutate',id:p.id,expectedRevision:p.revision,command:'save_plan',payload:{plan,evidence:{...evidence,confirmed:false}}});
 const result=await f.handler({action:'tasks.run',id:p.id,taskId:p.workflow.task.id});assert.equal(result.data.workflow.task.status,'superseded');assert.equal(calls,0);
});
test('render refuses a stale audit or a blocking fact issue',async()=>{
 const f=setup();let p=(await f.handler({action:'projects.create',candidate})).data;
 f.records.get(p.id).workflow.documents=analysis.documents;
 p=(await f.handler({action:'projects.mutate',id:p.id,expectedRevision:p.revision,command:'approve_plan',payload:{plan,evidence}})).data;
 f.records.get(p.id).workflow.audit={checkedMarkdown:'Another body',issues:[]};
 const event={action:'projects.mutate',id:p.id,expectedRevision:p.revision,command:'render',payload:{markdown:'Body',audited:true}};
 assert.equal((await f.handler(event)).error.code,'INVALID_STATE');
 f.records.get(p.id).workflow.audit={checkedMarkdown:'Body',issues:[{severity:'blocking',text:'Unsupported number'}]};
 assert.equal((await f.handler(event)).error.code,'INVALID_STATE');assert.equal(f.records.get(p.id).output.html,'');
});

test('draft revision validates and persists user instructions before model execution',async()=>{
 const f=setup({aiConfigured:true,runWorkflow:async()=>analysis});
 let p=(await f.handler({action:'projects.create',candidate})).data;
 const stored=f.records.get(p.id);stored.plan=plan;stored.workflow.documents=analysis.documents;stored.workflow.approval={plan,documents:analysis.documents,claims:analysis.claims};stored.stage='plan_ready';
 const start=instruction=>f.handler({action:'tasks.start',id:p.id,expectedRevision:p.revision,kind:'draft',input:{instruction}});
 assert.equal((await start('修改开篇')).error.code,'INVALID_STATE');
 stored.draft.markdown='Current body';
 assert.equal((await start('')).error.code,'INVALID_INPUT');
 assert.equal((await start('x'.repeat(4001))).error.code,'INVALID_INPUT');
 const result=await start('说明投入不等于效果');assert.equal(result.ok,true);assert.equal(result.data.workflow.task.input.instruction,'说明投入不等于效果');
});
