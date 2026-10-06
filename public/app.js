import {upgrade,afterManualChange} from '/workflow.js';
import {escape as e,safeUrl,createProject,applyProjectAction,renderArticle} from '/domain.js';
import {config} from './config.js';
import * as cloud from './cloud-client.js';
const app=document.querySelector('#app');
const cloudMode=config.mode==='cloud';
let capabilities={ai:false},activeProject='',autosaveTimer,feedAttempted=false,visibleLimit=50;
let projects=[],feedItems=[],basket=new Set(),windowSize='24h',loading=false,feedError='',feedMeta='',search='',busy=false,connected=false,uid='',booting=cloudMode;
if(!cloudMode) {
  try{projects=JSON.parse(localStorage.getItem('writter.projects.v1') || '[]');if(!Array.isArray(projects))throw Error();}catch{app.innerHTML='<main>本地数据无法读取。请先备份浏览器数据后再重试。</main>';throw Error('Storage invalid');}
}
function localSave(next){try{localStorage.setItem('writter.projects.v1',JSON.stringify(next));}catch{throw Error('保存失败：浏览器存储空间不足，请保留当前文本。');}}
async function addProject(candidate){
  let p;
  if(cloudMode)p=await cloud.call('projects.create',{candidate});
  else p=projects.find(x=>x.candidate.provider===candidate.provider&&x.candidate.externalId===candidate.externalId)||upgrade(createProject(candidate));
  const next=projects.filter(x=>x.id!==p.id).concat(p);
  if(!cloudMode)localSave(next);
  projects=next;return p;
}
async function command(p,action,payload={}){
  p=projects.find(x=>x.id===p.id)||p;
  const next=cloudMode?await cloud.call('projects.mutate',{id:p.id,expectedRevision:p.revision,command:action,payload}):afterManualChange(p,applyProjectAction(p,action,payload),action);
  const list=projects.map(x=>x.id===p.id?next:x);
  if(!cloudMode)localSave(list);
  projects=list;return next;
}
async function connect(){
  const identity=await cloud.call('whoami');uid=identity.uid;
  if(!identity.authorized)throw Error(`该账号尚未获得工作台权限。请把 UID ${uid} 填入云函数环境变量 WRITTER_ALLOWED_UIDS。`);
  const list=[];let offset=0;
  do{const data=await cloud.call('projects.list',{offset});list.push(...data.items);offset=data.nextOffset;}while(offset!==null);
  capabilities=await cloud.call('capabilities');
  projects=list.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));connected=true;
}
const notify=message=>{const el=document.createElement('div');el.className='toast';el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),4500);};
const route=()=>location.hash.slice(1).split('/').filter(Boolean);
const projectLoads=new Map(),projectLoadErrors=new Map();
const current=()=>{const p=projects.find(p=>p.id===route()[1]);return p&&!p.partial?upgrade(p):p;};
const nav=path=>{location.hash='/'+path;};
const field=(id,title,value,area=false)=>`<label for="${id}">${title}</label>${area?`<textarea id="${id}">${e(value)}</textarea>`:`<input type="text" id="${id}" value="${e(value)}">`}`;
const button=(id,text,primary=false,disabled=false)=>`<button id="${id}" class="${primary?'primary':''}" ${disabled?'disabled':''}>${text}</button>`;
function shell(body){document.body.className='';app.innerHTML=`<header><div><b>writter<span style="color:#88a579">.</span></b> <small>你的 AI 编辑工作台</small></div><nav>${button('nav-pool','01 热点池')}${button('nav-desk','02 编辑策划')}${button('nav-studio','03 写作工作室')}${cloudMode?button('logout','退出登录'):''}</nav></header><main>${body}</main>`;on('logout',async()=>{await cloud.logout();connected=false;uid='';projects=[];feedItems=[];basket.clear();feedAttempted=false;render();});on('nav-pool',()=>nav('pool'));on('nav-desk',()=>nav(projects.length?'desk/'+(current()?.id||activeProject||projects[0].id):'desk'));on('nav-studio',()=>nav(projects.length?'studio/'+(current()?.id||activeProject||projects[0].id):'studio'));}
function on(id,fn,event='click'){document.getElementById(id)?.addEventListener(event,async ev=>{if(event==='input'){try{fn(ev);}catch(err){notify(err.message);}return;}if(event==='submit')ev.preventDefault();if(busy){notify('当前操作正在处理，请稍候');return;}busy=true;const el=ev.currentTarget;const disabled=el.disabled;const caption=el.textContent;if(el.tagName==='BUTTON'){el.disabled=true;el.textContent='处理中…';}try{await fn(ev);}catch(err){notify(err.message);}finally{busy=false;if(el.isConnected&&el.tagName==='BUTTON'){el.disabled=disabled;el.textContent=caption;}}});}
function intro(n,title,description){return `<div class="intro"><div class="eyebrow">${n} / EDITORIAL WORKFLOW</div><h1>${title}</h1><p class="muted">${description}</p></div>`;}
async function loadFeed(){if(loading)return;feedAttempted=true;rememberManual();loading=true;feedError='';render();try{let data;if(cloudMode)data=await cloud.call('feed',{window:windowSize});else{const r=await fetch('/api/feed?window='+windowSize);data=await r.json();if(!r.ok)throw Error(data.error || '热点读取失败');}feedItems=data.items.sort((a,b)=>(b.publishedAt||'').localeCompare(a.publishedAt||''));feedMeta=`资讯更新时间：${data.generatedAt?new Date(data.generatedAt).toLocaleString('zh-CN'):'未知'}`;basket=new Set([...basket].filter(k=>feedItems.some(x=>x.externalId===k)));}catch(err){feedError=err.message;}finally{loading=false;render();}}
let manualCache={title:'',url:''};
function rememberManual(){manualCache={title:document.getElementById('manual-title')?.value||manualCache.title,url:document.getElementById('manual-url')?.value||manualCache.url};}
function pool(){
 if(cloudMode&&connected&&!feedAttempted){feedAttempted=true;queueMicrotask(loadFeed);}
 const visible=feedItems.filter(x=>(x.title+x.sourceName).toLowerCase().includes(search.toLowerCase()));
 shell(intro('01','从信息流，找到值得写的事。','勾选或拖入待处理，再进入编辑策划。聚合内容是选题线索，仍需核验原始来源。')+`<div class="toolbar"><select id="window" aria-label="时间范围"><option value="24h" ${windowSize==='24h'?'selected':''}>过去 24 小时</option><option value="7d" ${windowSize==='7d'?'selected':''}>过去 7 天</option></select>${button('refresh',loading?'正在读取…':'刷新热点',false,loading)}<input id="search" type="text" placeholder="搜索标题、来源" value="${e(search)}" style="max-width:320px"> <span class="muted">${visible.length} 条</span></div>${feedError?`<div class="notice">读取失败：${e(feedError)}。可重试，或手动添加选题。</div>`:''}<p class="muted"><small>${e(feedMeta || '点击刷新获取实时聚合资讯。')}</small></p><div class="grid"><section>${visible.length?visible.slice(0,visibleLimit).map(x=>`<article class="card" draggable="true" data-drag="${e(x.externalId)}"><input type="checkbox" aria-label="选择 ${e(x.title)}" data-pick="${e(x.externalId)}" ${basket.has(x.externalId)?'checked':''}><div class="content"><span class="badge">${e(x.sourceName)}</span><h3>${e(x.title)}</h3><small>${e(x.publishedAt?new Date(x.publishedAt).toLocaleString('zh-CN'):'')}</small>${x.summary?`<p class="muted">${e(x.summary)}</p>`:''}<p><a href="${e(x.originalUrl)}" target="_blank" rel="noopener noreferrer">查看来源 ↗</a></p></div></article>`).join(''):`<div class="panel empty">${loading?'正在读取上游内容…':'暂无资讯，刷新热点或添加自己的选题。'}</div>`}${visible.length>visibleLimit?button('more-feed','加载更多资讯'):''}</section><aside><div class="panel"><h2>待策划选题</h2><div id="drop" class="drop">${basket.size?[...basket].map(id=>`<p>${e(feedItems.find(x=>x.externalId===id)?.title)}</p>`).join(''):'把值得写的内容放在这里'}</div><div class="toolbar">${button('process',`处理已选 ${basket.size} 条 →`,true,!basket.size)}</div></div><div class="panel"><h3>手动添加选题</h3>${field('manual-title','选题标题',manualCache.title)}${field('manual-url','原始来源 URL',manualCache.url)}${button('manual','加入待处理')}</div><small>已保存 ${projects.length} 个选题 · ${cloudMode?'当前存储于 CloudBase':'当前存储于此浏览器'}</small></aside></div>`);
 on('more-feed',()=>{visibleLimit+=50;rememberManual();pool();});on('refresh',loadFeed);on('window',ev=>{windowSize=ev.target.value;feedItems=[];basket.clear();return loadFeed();},'change');on('search',ev=>{search=ev.target.value;visibleLimit=50;const pos=ev.target.selectionStart;rememberManual();pool();const input=document.getElementById('search');input.focus();input.setSelectionRange(pos,pos);},'input');
 document.querySelectorAll('[data-pick]').forEach(el=>el.onchange=()=>{el.checked?basket.add(el.dataset.pick):basket.delete(el.dataset.pick);rememberManual();pool();});
 document.querySelectorAll('[data-drag]').forEach(el=>el.ondragstart=ev=>ev.dataTransfer.setData('text/plain',el.dataset.drag));
 const drop=document.getElementById('drop');drop.ondragover=ev=>{ev.preventDefault();drop.classList.add('over');};drop.ondragleave=()=>drop.classList.remove('over');drop.ondrop=ev=>{ev.preventDefault();const id=ev.dataTransfer.getData('text/plain');if(feedItems.some(x=>x.externalId===id))basket.add(id);pool();};
 on('process',async()=>{let first;for(const id of [...basket]){const item=feedItems.find(x=>x.externalId===id);if(!item)continue;const p=await addProject(item);basket.delete(id);first ||= p;}if(first)nav('desk/'+first.id);});
 on('manual',async()=>{const title=document.getElementById('manual-title').value.trim(),raw=document.getElementById('manual-url').value.trim();if(!title)throw Error('请填写标题');if(raw&&!safeUrl(raw))throw Error('请输入有效的 HTTP/HTTPS 链接');const p=await addProject({provider:'manual',externalId:crypto.randomUUID(),title,summary:'',originalUrl:safeUrl(raw),sourceName:'手动添加',publishedAt:new Date().toISOString(),category:'manual'});nav('desk/'+p.id);});

}
const stageName={selected:'待检测',planning:'待确认策划',plan_ready:'可生成正文',draft_ready:'待复查与排版',preview_ready:'可复制发布'};
function queue(stage,p){return `<aside class="panel queue"><h3>我的选题</h3>${projects.map(x=>`<button data-project="${x.id}" class="${p?.id===x.id?'active':''}">${e(x.plan.title)}<br><small>${e(stageName[x.stage]||'待处理')}</small></button>`).join('')}</aside>`;}
function bindQueue(page){document.querySelectorAll('[data-project]').forEach(el=>el.onclick=()=>{if(!busy)nav(page+'/'+el.dataset.project);});}
const bufferKey=p=>`writter.edit.${uid||'local'}.${p.id}`;
function buffer(p){try{return JSON.parse(localStorage.getItem(bufferKey(p))||'{}');}catch{return {};}}
function remember(p,data){localStorage.setItem(bufferKey(p),JSON.stringify({revision:p.revision,...data}));}
function taskPanel(p){
 const t=p.workflow.task;if(!t)return '';
 const labels={analyze:'检测与策划',adjust:'调整策划',draft:'生成正文',audit:'正文复查'};
 if(['pending','running'].includes(t.status))return `<div class="notice" role="status">${labels[t.kind]}${Date.now()>t.expiresAt?'等待时间已超过预期，可重新发起。':'正在处理中，结果会保存到当前选题。'} ${button('resume-task','读取任务进度')}</div>`;
 return t.status==='failed'||t.status==='superseded'?`<div class="notice" role="alert">${e(t.message)}</div>`:'';
}
function updateProject(p){projects=projects.map(x=>x.id===p.id?p:x);if(!cloudMode)localSave(projects);}
async function refreshProject(id){if(cloudMode){const p=await cloud.call('projects.get',{id});updateProject(p);return p;}return projects.find(x=>x.id===id);}
async function runTask(p,kind,input={}){
 if(!cloudMode)throw Error('真实 AI 任务需要云端服务。请使用部署后的工作台。');
 if(!capabilities.ai)throw Error('请先在云函数配置 DeepSeek 密钥，然后重新连接工作台。');
 const latest=projects.find(x=>x.id===p.id)||p;
 const started=await cloud.call('tasks.start',{id:p.id,expectedRevision:latest.revision,kind,input});updateProject(started);render();
 const done=await cloud.call('tasks.run',{id:p.id,taskId:started.workflow.task.id});updateProject(done);render();
 if(done.workflow.task?.status==='failed')notify(done.workflow.task.message);
}
function bindTask(p){on('resume-task',async()=>{const next=await refreshProject(p.id);if(next.workflow?.task?.status==='pending'){const done=await cloud.call('tasks.run',{id:p.id,taskId:next.workflow.task.id});updateProject(done);}render();});}
function autosave(p,kind,read){
 const data=read();remember(p,data);document.getElementById('save-state').textContent='已在此浏览器暂存，正在保存…';clearTimeout(autosaveTimer);
 autosaveTimer=setTimeout(async()=>{
  if(busy||route()[1]!==p.id)return;
  try{
   const snapshot=JSON.stringify(buffer(p));
   await command(p,kind,kind==='save_plan'?{plan:data.plan,evidence:{...p.evidence,confirmed:false}}:{markdown:data.markdown});
   if(JSON.stringify(buffer(p))===snapshot)localStorage.removeItem(bufferKey(p));
   const el=document.getElementById('save-state');if(el)el.textContent='已保存';
  }catch(err){const el=document.getElementById('save-state');if(el)el.textContent='仍保留浏览器暂存 · '+err.message;}
 },1000);
}
function desk(p){
 if(!p){shell(intro('02','编辑策划','先从热点池选择一个选题。')+button('back','返回热点池',true));on('back',()=>nav('pool'));return;}
 activeProject=p.id;const saved=buffer(p),plan=saved.plan||p.plan;
 const documents=p.workflow.documents,claims=p.workflow.claims;
 shell(intro('02','先看证据，再确认怎么写。','读取原始来源，检查事实依据，形成策划；你可以直接提出修改意见。')+`<div class="grid desk">${queue('desk',p)}<section>${taskPanel(p)}<div class="panel"><span class="badge">${e(p.candidate.sourceName)}</span><h2>${e(p.candidate.title)}</h2>${p.candidate.originalUrl?`<a href="${e(safeUrl(p.candidate.originalUrl))}" target="_blank" rel="noopener noreferrer">原始来源 ↗</a>`:''}<details><summary>补充来源</summary>${field('source-urls','其他公开来源 URL（每行一个，最多 4 个）','',true)}</details><div class="toolbar">${button('analyze',documents.length?'重新检测并策划':'检测来源并生成策划',true,!capabilities.ai)}</div>${!capabilities.ai?'<p class="muted">模型服务尚未连接。配置完成后，这里会自动生成证据与策划。</p>':''}</div>${documents.length?`<div class="panel"><h3>检测结果与来源依据</h3>${p.workflow.warnings.map(x=>`<p class="notice">${e(x)}</p>`).join('')}${claims.map(x=>`<div class="fact"><p><strong>${e(x.text)}</strong></p><blockquote>${e(x.quote)}</blockquote><a href="${e(safeUrl(documents.find(d=>d.id===x.sourceId)?.url))}" target="_blank" rel="noopener noreferrer">查看对应来源 ↗</a></div>`).join('')}<details><summary>已读取 ${documents.length} 个来源</summary>${documents.map(x=>`<p><a href="${e(safeUrl(x.url))}" target="_blank" rel="noopener noreferrer">${e(x.url)}</a></p>`).join('')}</details></div>`:''}<div class="panel"><h3>文章策划</h3>${field('title','标题',plan.title)}${field('angle','写给谁、回答什么、读者能获得什么',plan.angle,true)}${field('outline','文章主线 · 各部分作用、依据与承接',plan.outline,true)}<p id="save-state" class="muted" role="status">${saved.plan?'已恢复浏览器暂存，请检查后保存':'改动后自动保存'}</p><div class="toolbar">${button('save-plan','保存策划')}${button('restore-plan','恢复上一版',false,!p.history.plan.length)}</div>${field('instruction','告诉 AI 怎么调整','',true)}${button('adjust','按我的意见调整',false,!capabilities.ai||!documents.length)}</div><div class="actions">${button('back','← 热点池')}${button('approve','确认策划，进入写作 →',true,!documents.length)}</div></section></div>`);
 bindQueue('desk');bindTask(p);on('back',()=>nav('pool'));
 const read=()=>({plan:{title:document.getElementById('title').value,angle:document.getElementById('angle').value,outline:document.getElementById('outline').value}});
 for(const id of ['title','angle','outline'])on(id,()=>autosave(p,'save_plan',read),'input');
 const save=async action=>{clearTimeout(autosaveTimer);const latest=current();const next=await command(latest,action,{...read(),evidence:{...latest.evidence,confirmed:action==='approve_plan'}});localStorage.removeItem(bufferKey(p));return next;};
 on('save-plan',async()=>{await save('save_plan');render();});
 on('approve',async()=>{await save('approve_plan');nav('studio/'+p.id);});
 on('restore-plan',async()=>{clearTimeout(autosaveTimer);await command(p,'restore_plan');localStorage.removeItem(bufferKey(p));render();});
 on('analyze',async()=>{if(buffer(p).plan)await save('save_plan');await runTask(current(),'analyze',{urls:document.getElementById('source-urls').value.split('\n').map(x=>x.trim()).filter(Boolean)});});
 on('adjust',async()=>{const instruction=document.getElementById('instruction').value;if(!instruction.trim())throw Error('请写下希望调整的内容');await save('save_plan');await runTask(current(),'adjust',{instruction});});
}
function reviewPanel(audit,checked){
 const labels={facts:'事实与证据',structure:'主线与结构',writing:'文字表达'},review=audit.review;
 return `<div class="panel"><h3>文章复查 ${checked?'':'· 需重新检查'}</h3><p class="muted">依据当前策划与已读取资料的 AI 审稿，请结合实际阅读判断成品。</p>${review?`<p>${e(review.summary)}</p><ul>${Object.entries(labels).map(([k,label])=>`<li>${label}：${review[k]==='pass'?'本次未发现问题':'建议修改'}</li>`).join('')}</ul>`:'<p class="notice">这份旧复查仅覆盖来源一致性，请重新复查文章结构与文字。</p>'}${audit.issues.length?audit.issues.map(x=>`<div class="notice"><strong>${x.severity==='blocking'?'需要修正':'建议审阅'} · ${labels[x.category]||'来源一致性'}</strong><p>${e(x.text)}</p><blockquote>${e(x.quote)}</blockquote>${x.suggestion?`<p>修改建议：${e(x.suggestion)}</p>`:''}</div>`).join(''):'<p>本次检查未列出问题；这不替代对阅读质量的判断。</p>'}</div>`;
}
function studio(p){
 if(!p){shell(intro('03','写作与预览','先确认一个选题的策划。'));return;}
 activeProject=p.id;const saved=buffer(p),markdown=saved.markdown??p.draft.markdown;
 const ready=!!p.workflow.approval&&!p.stale.draft||!!p.workflow.approval&&p.stage==='plan_ready';
 const audit=p.workflow.audit,issues=audit?.issues||[],checked=audit?.checkedMarkdown===markdown;
 shell(intro('03','从确认的策划，得到可发布的文章。','按确认的主线展开正文，检查事实、结构与文字，再排版预览。')+`<div class="grid desk">${queue('studio',p)}<section>${taskPanel(p)}<div class="panel"><h2>${e(p.plan.title)}</h2><p>${e(p.plan.angle)}</p><details><summary>查看确认的主线与段落推进</summary><pre class="structure">${e(p.workflow.approval?.plan.outline||p.plan.outline)}</pre></details>${!ready?'<p class="notice">策划尚未确认或已修改，请返回策划确认。</p>':''}<div class="toolbar">${button('generate',p.draft.markdown?'重新生成正文':'生成正文',true,!ready||!capabilities.ai)}</div><label for="draft">正文</label><textarea id="draft" class="draft">${e(markdown)}</textarea><p id="save-state" class="muted" role="status">${saved.markdown!==undefined?'已恢复浏览器暂存':'正文改动后自动保存'}</p><div class="toolbar">${button('save-draft','保存正文',false,!ready)}${button('restore-draft','恢复上一版',false,!p.history.draft.length)}${button('audit-draft','复查事实、结构与文字',false,!ready||!markdown.trim()||!capabilities.ai)}</div>${field('draft-instruction','希望正文怎么改（换主线请返回策划）','',true)}${button('revise-draft','按我的意见修改正文',false,!ready||!markdown.trim()||!capabilities.ai)}</div>${audit?reviewPanel(audit,checked):''}${p.visual.suggestions?.length?`<details class="panel"><summary>配图建议（尚未生成图片）</summary>${p.visual.suggestions.map(x=>`<p><strong>${e(x.position)}</strong> · ${e(x.description)}</p>`).join('')}</details>`:''}<div class="actions">${button('back','← 返回策划')}${button('preview','排版并预览',true,!ready||!checked||issues.some(x=>x.severity==='blocking'))}</div>${p.output.html?`<div class="preview-layout"><div class="toolbar"><h3>文章预览 ${p.stale.render?'· 待更新':''}</h3><span class="muted">基础编辑排版 · V25 尚待参考文件</span></div><div class="paper">${p.output.html}</div><div class="toolbar">${button('copy','打开纯复制页 →',true,p.stale.render)}</div></div>`:''}</section></div>`);
 bindQueue('studio');bindTask(p);on('back',()=>nav('desk/'+p.id));
 const read=()=>({markdown:document.getElementById('draft').value});
 on('draft',()=>{autosave(p,'save_draft',read);document.getElementById('preview').disabled=true;const copy=document.getElementById('copy');if(copy)copy.disabled=true;document.getElementById('audit-draft').disabled=!ready||!read().markdown.trim()||!capabilities.ai;},'input');
 const save=async()=>{clearTimeout(autosaveTimer);const next=await command(current(),'save_draft',read());localStorage.removeItem(bufferKey(p));return next;};
 on('save-draft',async()=>{await save();render();});
 on('generate',async()=>{if(buffer(p).markdown!==undefined&&read().markdown.trim())await save();await runTask(current(),'draft');});
 on('audit-draft',async()=>{await save();await runTask(current(),'audit');});
 on('revise-draft',async()=>{const instruction=document.getElementById('draft-instruction').value.trim();if(!instruction)throw Error('请写下希望正文如何修改');await save();await runTask(current(),'draft',{instruction});});
 on('preview',async()=>{clearTimeout(autosaveTimer);await command(current(),'render',{...read(),audited:true});localStorage.removeItem(bufferKey(p));render();});
 on('restore-draft',async()=>{clearTimeout(autosaveTimer);await command(p,'restore_draft');localStorage.removeItem(bufferKey(p));render();});
 on('copy',()=>window.open('/#/copy/'+p.id,'_blank','noopener'));
}
function render(){if(booting){app.innerHTML='<main>正在连接工作台…</main>';return;}if(cloudMode&&!connected){loginPage();return;}const [page]=route(),p=current();
if(cloudMode&&p?.partial){const error=projectLoadErrors.get(p.id);shell(`<div class="panel">${error?e(error):'正在读取选题…'}${error?button('reload-project','重新读取'):''}</div>`);if(error){on('reload-project',()=>{projectLoadErrors.delete(p.id);render();});return;}if(!projectLoads.has(p.id)){const task=cloud.call('projects.get',{id:p.id}).then(next=>{projects=projects.map(x=>x.id===next.id?next:x);}).catch(err=>projectLoadErrors.set(p.id,err.message)).finally(()=>{projectLoads.delete(p.id);render();});projectLoads.set(p.id,task);}return;}
if(page==='copy'){document.body.className='copy';app.innerHTML=p&&!p.stale.render&&p.output.html?p.output.html:'<p>预览尚未生成或已过期，请返回工作台更新。</p>';return;}if(page==='desk')desk(p);else if(page==='studio')studio(p);else pool();}
let loginError='';
function loginPage(){document.body.className='';app.innerHTML=`<main style="max-width:540px"><div class="eyebrow">WRITTER / SHANGHAI</div><h1>登录你的编辑工作台</h1><p class="muted">使用在 CloudBase 身份认证中创建的账号。</p><form id="login-form" class="panel"><label for="username">用户名</label><input id="username" type="text" autocomplete="username" required><label for="password">密码</label><input id="password" type="password" autocomplete="current-password" required style="width:100%;padding:13px;border:1px solid #dce2d9;border-radius:8px"><div class="toolbar"><button class="primary" type="submit">登录</button></div>${loginError?`<p class="notice">${e(loginError)}</p>`:''}</form>${uid?button('retry','重新连接'):''}</main>`;on('login-form',async ev=>{ev.preventDefault();const btn=document.querySelector('#login-form button');btn.disabled=true;btn.textContent='正在登录…';try{await cloud.login(document.getElementById('username').value.trim(),document.getElementById('password').value);await connect();loginError='';render();}catch(err){loginError=err.message;loginPage();}},'submit');on('retry',async()=>{try{await connect();loginError='';render();}catch(err){loginError=err.message;loginPage();}});}
let polling=false;
setInterval(async()=>{
 const p=current();if(!cloudMode||!connected||!p||p.partial||busy||polling||!['pending','running'].includes(p.workflow?.task?.status))return;
 polling=true;try{let next=await refreshProject(p.id);if(next.workflow?.task?.status==='pending'&&Date.now()<next.workflow.task.expiresAt){next=await cloud.call('tasks.run',{id:p.id,taskId:next.workflow.task.id});updateProject(next);}if(next.revision!==p.revision&&route()[1]===p.id)render();}catch{ /* Keep current edits; explicit progress read can retry. */ }finally{polling=false;}
},3000);
window.addEventListener('hashchange',()=>{clearTimeout(autosaveTimer);render();});
window.addEventListener('beforeunload',ev=>{const p=current();if(p&&!p.partial&&Object.keys(buffer(p)).length){ev.preventDefault();ev.returnValue='';}});render();
if(cloudMode){try{if(await cloud.session())await connect();}catch(err){loginError=/credentials not found/i.test(err.message)?'':err.message;}finally{booting=false;render();}}



