import {upgrade,afterManualChange,completeTask} from '../src/workflow.js';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Window} from 'happy-dom';
import {build} from 'esbuild';
import {resolve} from 'node:path';
import {createProject,applyProjectAction} from '../src/domain.js';
async function mount(mode='local',api){
 const w=new Window({url:'http://localhost:3000',settings:{disableCSSFileLoading:true,disableComputedStyleRendering:true}});
 w.document.body.innerHTML='<div id="app"></div>';w.structuredClone=structuredClone;w.__api=api;
 const out=await build({entryPoints:['public/app.js'],bundle:true,write:false,format:'esm',platform:'browser',plugins:[{name:'test-adapters',setup(b){b.onResolve({filter:/^\/workflow\.js$/},()=>({path:resolve('src/workflow.js')}));b.onResolve({filter:/^\/domain\.js$/},()=>({path:resolve('src/domain.js')}));b.onResolve({filter:/config\.js$/},()=>({path:'config',namespace:'fake'}));b.onResolve({filter:/cloud-client\.js$/},()=>({path:'cloud',namespace:'fake'}));b.onLoad({filter:/.*/,namespace:'fake'},args=>({contents:args.path==='config'?`export const config={mode:'${mode}'};`:'export const session=()=>window.__api.session(); export const login=(...args)=>window.__api.login(...args); export const logout=()=>window.__api.logout(); export const call=(...args)=>window.__api.call(...args);',loader:'js'}));}}]});
 await w.eval(`(async()=>{${out.outputFiles[0].text}\n})()`);
 return w;
}
const tick=()=>new Promise(r=>setTimeout(r,15));
async function click(w,id){const el=w.document.getElementById(id);assert.ok(el,'missing '+id);el.click();await tick();}
function fill(w,id,value){const el=w.document.getElementById(id);assert.ok(el,'missing '+id);el.value=value;el.dispatchEvent(new w.Event('input',{bubbles:true}));}
function fakeAPI(){
 let project,fail=false;const calls=[];
 const api={session:async()=>({}),call:async(action,data)=>{
  calls.push(action);if(action==='whoami')return {uid:'owner',authorized:true};if(action==='capabilities')return {ai:true};
  if(action==='projects.list')return {items:project?[project]:[],nextOffset:null};
  if(action==='projects.create'){project=upgrade(createProject(data.candidate,'a'.repeat(64)));return structuredClone(project);}
  if(action==='projects.get')return structuredClone(project);
  if(action==='projects.mutate'){if(fail)throw Object.assign(new Error('版本冲突'),{code:'CONFLICT'});project=afterManualChange(project,applyProjectAction(project,data.command,data.payload),data.command);return structuredClone(project);}
  if(action==='tasks.start'){project.workflow.task={id:'task',kind:data.kind,status:'pending',expiresAt:Date.now()+100000};project.revision++;return structuredClone(project);}
  if(action==='tasks.run'){
   const kind=project.workflow.task.kind;
   project=completeTask(project,kind==='analyze'?{plan:{title:'文章标题',angle:'用户影响',outline:'事实与影响'},documents:[{id:'s',url:'https://example.com/',text:'原始事实'}],claims:[{text:'有依据的事实',quote:'原始事实',sourceId:'s'}],warnings:['仅一个来源']}:kind==='draft'?{markdown:'## 标题\n\n正文<script>',visuals:[]}:kind==='audit'?{issues:[]}:{plan:{...project.plan,angle:'新角度'},documents:project.workflow.documents,claims:project.workflow.claims,warnings:[]});
   return structuredClone(project);
  }throw Error(action);
 }};return {api,calls,setFail:v=>fail=v,get:()=>project};
}
test('cloud editorial journey: detection, confirmation, generation, audit, preview and invalidation',async()=>{
 const f=fakeAPI(),w=await mount('cloud',f.api);try{
  fill(w,'manual-title','流程测试');fill(w,'manual-url','https://example.com');await click(w,'manual');
  assert.equal(w.document.getElementById('approve').disabled,true);
  await click(w,'analyze');assert.match(w.document.body.textContent,/有依据的事实/);
  await click(w,'approve');assert.match(w.location.hash,/studio/);
  await click(w,'generate');await click(w,'audit-draft');await click(w,'preview');
  assert.ok(w.document.querySelector('.paper'));assert.ok(!w.document.querySelector('.paper script'));assert.equal(w.document.getElementById('copy').disabled,false);
  fill(w,'draft','修改正文');assert.equal(w.document.getElementById('preview').disabled,true);assert.equal(w.document.getElementById('copy').disabled,true);
  await click(w,'save-draft');await click(w,'back');fill(w,'angle','新角度');await click(w,'save-plan');await click(w,'nav-studio');
  assert.equal(w.document.getElementById('preview').disabled,true);assert.equal(f.get().stale.draft,true);
 }finally{await w.happyDOM.close();}
});
test('revision conflict retains input and durable browser buffer',async()=>{
 const f=fakeAPI(),w=await mount('cloud',f.api);try{
  fill(w,'manual-title','Cloud project');await click(w,'manual');fill(w,'angle','未保存输入');f.setFail(true);await click(w,'save-plan');
  assert.equal(w.document.getElementById('angle').value,'未保存输入');assert.match(w.document.querySelector('.toast').textContent,/版本冲突/);
  assert.match(w.localStorage.getItem('writter.edit.owner.'+'a'.repeat(64)),/未保存输入/);
 }finally{await w.happyDOM.close();}
});
test('cloud login gate requires a session and captures submit without page navigation',async()=>{let logged=false;const api={session:async()=>null,login:async(user,password)=>{assert.equal(user,'asteria');assert.equal(password,'test-password');logged=true;return {};},call:async action=>action==='whoami'?{uid:'owner',authorized:true}:{items:[],nextOffset:null}};const w=await mount('cloud',api);try{assert.ok(w.document.getElementById('login-form'));fill(w,'username','asteria');fill(w,'password','test-password');const ev=new w.Event('submit',{bubbles:true,cancelable:true});w.document.getElementById('login-form').dispatchEvent(ev);await tick();assert.equal(ev.defaultPrevented,true);assert.equal(logged,true);assert.ok(w.document.getElementById('manual-title'));}finally{await w.happyDOM.close();}});
test('installed browser SDK exposes the authentication and function APIs actually used',async()=>{const out=await build({entryPoints:['src/cloud-sdk.js'],bundle:true,write:false,format:'iife',globalName:'WritterSDK',platform:'browser'});const w=new Window({url:'http://localhost:3000'});try{w.eval(out.outputFiles[0].text);const app=w.eval("WritterSDK.default.init({env:'writter-dev-d0g7h1prq4ce60665',region:'ap-shanghai'})");assert.equal(typeof app.auth.getSession,'function');assert.equal(typeof app.auth.signInWithPassword,'function');assert.equal(typeof app.callFunction,'function');}finally{await w.happyDOM.close();}});
