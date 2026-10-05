import {escape as e,safeUrl,createProject,applyProjectAction,renderArticle} from '/domain.js';
import {config} from './config.js';
import * as cloud from './cloud-client.js';
const app=document.querySelector('#app');
const cloudMode=config.mode==='cloud';
let projects=[],feedItems=[],basket=new Set(),windowSize='24h',loading=false,feedError='',feedMeta='',search='',busy=false,connected=false,uid='',booting=cloudMode;
if(!cloudMode) {
  try{projects=JSON.parse(localStorage.getItem('writter.projects.v1') || '[]');if(!Array.isArray(projects))throw Error();}catch{app.innerHTML='<main>本地数据无法读取。请先备份浏览器数据后再重试。</main>';throw Error('Storage invalid');}
}
function localSave(next){try{localStorage.setItem('writter.projects.v1',JSON.stringify(next));}catch{throw Error('保存失败：浏览器存储空间不足，请保留当前文本。');}}
async function addProject(candidate){
  let p;
  if(cloudMode)p=await cloud.call('projects.create',{candidate});
  else p=projects.find(x=>x.candidate.provider===candidate.provider&&x.candidate.externalId===candidate.externalId)||createProject(candidate);
  const next=projects.filter(x=>x.id!==p.id).concat(p);
  if(!cloudMode)localSave(next);
  projects=next;return p;
}
async function command(p,action,payload={}){
  const next=cloudMode?await cloud.call('projects.mutate',{id:p.id,expectedRevision:p.revision,command:action,payload}):applyProjectAction(p,action,payload);
  const list=projects.map(x=>x.id===p.id?next:x);
  if(!cloudMode)localSave(list);
  projects=list;return next;
}
async function connect(){
  const identity=await cloud.call('whoami');uid=identity.uid;
  if(!identity.authorized)throw Error(`该账号尚未获得工作台权限。请把 UID ${uid} 填入云函数环境变量 WRITTER_ALLOWED_UIDS。`);
  const list=[];let offset=0;
  do{const data=await cloud.call('projects.list',{offset});list.push(...data.items);offset=data.nextOffset;}while(offset!==null);
  projects=list.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));connected=true;
}
const notify=message=>{const el=document.createElement('div');el.className='toast';el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),4500);};
const route=()=>location.hash.slice(1).split('/').filter(Boolean);
const projectLoads=new Map(),projectLoadErrors=new Map();
const current=()=>projects.find(p=>p.id===route()[1]);
const nav=path=>{location.hash='/'+path;};
const field=(id,title,value,area=false)=>`<label for="${id}">${title}</label>${area?`<textarea id="${id}">${e(value)}</textarea>`:`<input type="text" id="${id}" value="${e(value)}">`}`;
const button=(id,text,primary=false,disabled=false)=>`<button id="${id}" class="${primary?'primary':''}" ${disabled?'disabled':''}>${text}</button>`;
function shell(body){document.body.className='';app.innerHTML=`<header><div><b>writter<span style="color:#88a579">.</span></b> <small>你的 AI 编辑工作台</small></div><nav>${button('nav-pool','01 热点池')}${button('nav-desk','02 编辑策划')}${button('nav-studio','03 写作工作室')}${cloudMode?button('logout','退出登录'):''}</nav></header><main>${cloudMode?'<p class="muted"><small>云端已连接 · 上海 · '+e(uid)+'</small></p>':''}${body}</main>`;on('logout',async()=>{await cloud.logout();connected=false;uid='';projects=[];feedItems=[];basket.clear();render();});on('nav-pool',()=>nav('pool'));on('nav-desk',()=>nav(projects.length?'desk/'+projects[0].id:'desk'));on('nav-studio',()=>nav(projects.length?'studio/'+projects[0].id:'studio'));}
function on(id,fn,event='click'){document.getElementById(id)?.addEventListener(event,async ev=>{if(event==='input'){try{fn(ev);}catch(err){notify(err.message);}return;}if(event==='submit')ev.preventDefault();if(busy)return;busy=true;const el=ev.currentTarget;const disabled=el.disabled;const caption=el.textContent;if(el.tagName==='BUTTON'){el.disabled=true;el.textContent='处理中…';}try{await fn(ev);}catch(err){notify(err.message);}finally{busy=false;if(el.isConnected&&el.tagName==='BUTTON'){el.disabled=disabled;el.textContent=caption;}}});}
function intro(n,title,description){return `<div class="intro"><div class="eyebrow">${n} / EDITORIAL WORKFLOW</div><h1>${title}</h1><p class="muted">${description}</p></div>`;}
async function loadFeed(){if(loading)return;loading=true;feedError='';render();try{let data;if(cloudMode)data=await cloud.call('feed',{window:windowSize});else{const r=await fetch('/api/feed?window='+windowSize);data=await r.json();if(!r.ok)throw Error(data.error || '热点读取失败');}feedItems=data.items;feedMeta=`聚合源更新：${data.generatedAt || '未知'} · AIHOT 独立接口待验证`;basket=new Set([...basket].filter(k=>feedItems.some(x=>x.externalId===k)));}catch(err){feedError=err.message;}finally{loading=false;render();}}
function pool(){
 const visible=feedItems.filter(x=>(x.title+x.sourceName).toLowerCase().includes(search.toLowerCase()));
 shell(intro('01','从信息流，找到值得写的事。','勾选或拖入待处理，再进入编辑策划。聚合内容是选题线索，仍需核验原始来源。')+`<div class="toolbar"><select id="window" aria-label="时间范围"><option value="24h" ${windowSize==='24h'?'selected':''}>过去 24 小时</option><option value="7d" ${windowSize==='7d'?'selected':''}>过去 7 天</option></select>${button('refresh',loading?'正在读取…':'刷新热点',false,loading)}<input id="search" type="text" placeholder="搜索标题、来源" value="${e(search)}" style="max-width:320px"> <span class="muted">${visible.length} 条</span></div>${feedError?`<div class="notice">读取失败：${e(feedError)}。可重试，或手动添加选题。</div>`:''}<p class="muted"><small>${e(feedMeta || '点击刷新获取实时聚合资讯。')}</small></p><div class="grid"><section>${visible.length?visible.slice(0,100).map(x=>`<article class="card" draggable="true" data-drag="${e(x.externalId)}"><input type="checkbox" aria-label="选择 ${e(x.title)}" data-pick="${e(x.externalId)}" ${basket.has(x.externalId)?'checked':''}><div class="content"><span class="badge">${e(x.sourceName)}</span><h3>${e(x.title)}</h3><small>${e(x.publishedAt || '')}</small><p><a href="${e(x.originalUrl)}" target="_blank" rel="noopener noreferrer">查看来源 ↗</a></p></div></article>`).join(''):`<div class="panel empty">${loading?'正在读取上游内容…':'暂无资讯，刷新热点或添加自己的选题。'}</div>`}${visible.length>100?'<small>当前展示前 100 条，可用搜索定位其他资讯。</small>':''}</section><aside><div class="panel"><h2>Page 2 · 待处理</h2><div id="drop" class="drop">${basket.size?[...basket].map(id=>`<p>${e(feedItems.find(x=>x.externalId===id)?.title)}</p>`).join(''):'把值得写的内容放在这里'}</div><div class="toolbar">${button('process',`处理已选 ${basket.size} 条 →`,true,!basket.size)}</div></div><div class="panel"><h3>手动添加选题</h3>${field('manual-title','选题标题','')}${field('manual-url','原始 URL（可选）','')}${button('manual','加入待处理')}</div><small>已保存 ${projects.length} 个选题 · ${cloudMode?'当前存储于 CloudBase':'当前存储于此浏览器'}</small></aside></div>`);
 on('refresh',loadFeed);on('window',ev=>{windowSize=ev.target.value;feedItems=[];basket.clear();return loadFeed();},'change');on('search',ev=>{search=ev.target.value;pool();document.getElementById('search').focus();},'input');
 document.querySelectorAll('[data-pick]').forEach(el=>el.onchange=()=>{el.checked?basket.add(el.dataset.pick):basket.delete(el.dataset.pick);pool();});
 document.querySelectorAll('[data-drag]').forEach(el=>el.ondragstart=ev=>ev.dataTransfer.setData('text/plain',el.dataset.drag));
 const drop=document.getElementById('drop');drop.ondragover=ev=>{ev.preventDefault();drop.classList.add('over');};drop.ondragleave=()=>drop.classList.remove('over');drop.ondrop=ev=>{ev.preventDefault();const id=ev.dataTransfer.getData('text/plain');if(feedItems.some(x=>x.externalId===id))basket.add(id);pool();};
 on('process',async()=>{let first;for(const id of [...basket]){const item=feedItems.find(x=>x.externalId===id);if(!item)continue;const p=await addProject(item);basket.delete(id);first ||= p;}if(first)nav('desk/'+first.id);});
 on('manual',async()=>{const title=document.getElementById('manual-title').value.trim(),raw=document.getElementById('manual-url').value.trim();if(!title)throw Error('请填写标题');if(raw&&!safeUrl(raw))throw Error('请输入有效的 HTTP/HTTPS 链接');const p=await addProject({provider:'manual',externalId:crypto.randomUUID(),title,summary:'',originalUrl:safeUrl(raw),sourceName:'手动添加',publishedAt:new Date().toISOString(),category:'manual'});nav('desk/'+p.id);});

}
function queue(stage,p){return `<aside class="panel queue"><h3>我的选题</h3>${projects.map(x=>`<button data-project="${x.id}" class="${p?.id===x.id?'active':''}">${e(x.plan.title)}<br><small>${e(x.stage)}</small></button>`).join('')}</aside>`;}
function bindQueue(page){document.querySelectorAll('[data-project]').forEach(el=>el.onclick=()=>{if(!busy)nav(page+'/'+el.dataset.project);});}
function desk(p){if(!p){shell(intro('02','编辑策划','先从热点池选择一个选题。')+button('back','返回热点池',true));on('back',()=>nav('pool'));return;}
 shell(intro('02','先确定事实，再决定怎么写。','在一个页面里完成来源核验、写作角度和文章结构。')+`<div class="notice">AI 核验与策划尚未配置。现在可手动补充资料并走通流程；系统不会自动宣称内容已核验。</div><div class="grid desk">${queue('desk',p)}<section><div class="panel"><span class="badge">${e(p.candidate.sourceName)}</span><h2>${e(p.candidate.title)}</h2>${p.candidate.originalUrl?`<a href="${e(safeUrl(p.candidate.originalUrl))}" target="_blank" rel="noopener noreferrer">打开原始来源 ↗</a>`:''}${field('sources','核验来源 URL（每行一个）',p.evidence.sources.join('\n'),true)}${field('notes','事实摘录与分析判断（注明对应来源）',p.evidence.notes,true)}<label><input id="verified" type="checkbox" ${p.evidence.confirmed?'checked':''}> 我已人工检查上述来源与事实</label></div><div class="panel">${field('title','文章标题',p.plan.title)}${field('angle','核心角度',p.plan.angle,true)}${field('outline','文章结构与各段目的',p.plan.outline,true)}<div class="toolbar">${button('restore-plan','恢复上一版',false,!p.history.plan.length)}</div></div><div class="actions">${button('back','← 热点池')}${button('save-plan','保存策划')}${button('approve','确认并送去写作 →',true)}</div></section></div>`);
 for(const id of ['sources','notes'])on(id,()=>{document.getElementById('verified').checked=false;},'input');
 bindQueue('desk');on('back',()=>nav('pool'));
 const payload=()=>{const urls=document.getElementById('sources').value.split('\n').map(x=>x.trim()).filter(Boolean);if(urls.some(x=>!safeUrl(x)))throw Error('来源中有无效链接');return {evidence:{sources:urls.map(safeUrl),notes:document.getElementById('notes').value,confirmed:document.getElementById('verified').checked},plan:{title:document.getElementById('title').value,angle:document.getElementById('angle').value,outline:document.getElementById('outline').value}};};
 on('save-plan',async()=>{await command(p,'save_plan',payload());render();notify('已保存；改动后正文与预览需要更新。');});
 on('approve',async()=>{await command(p,'approve_plan',payload());nav('studio/'+p.id);});
 on('restore-plan',async()=>{await command(p,'restore_plan');render();notify('已恢复上一版，正文与预览已标记过期');});

}
function studio(p){if(!p){shell(intro('03','写作工作室','先确认一个选题的策划。'));return;}
 const ready=p.stage==='plan_ready'||(!p.stale.draft && ['draft_ready','preview_ready'].includes(p.stage));
 shell(intro('03','把已确认的思路，变成文章。','正文、事实复查、配图和预览都留在这里。')+`<div class="toolbar"><span class="step">正文</span><span class="step">事实复查</span><span class="step">配图（待接入）</span><span class="step">预览</span></div><div class="grid desk">${queue('studio',p)}<section>${!ready?'<div class="notice">策划尚未确认或已修改。请返回策划确认，再更新正文。</div>':''}<div class="panel"><h2>${e(p.plan.title)}</h2><p class="muted">${e(p.plan.angle)}</p><details><summary>查看已确认结构与资料</summary><pre style="white-space:pre-wrap">${e(p.plan.outline)}\n\n${e(p.evidence.notes)}</pre></details><div class="notice">真实 AI 写作、联网事实检查和生图待配置。本轮可人工填写正文与复查，预览使用基础排版；精确 V25 样式待提供参考文件。</div><label for="draft">正文（空行分段，## 开头为二级标题）</label><textarea id="draft" class="draft">${e(p.draft.markdown)}</textarea><label><input id="audit" type="checkbox"> 我已复查当前正文的事实与来源</label><div class="toolbar">${button('save-draft','保存正文',false,!ready)}${button('restore-draft','恢复上一版',false,!p.history.draft.length)}${button('preview','确认正文并生成预览',true,!ready)}</div></div>${p.output.html?`<div class="panel"><h3>文章预览 ${p.stale.render?'· 已过期':''}</h3><div class="paper">${renderArticle(p.plan.title,p.draft.markdown)}</div></div>`:''}<div class="actions">${button('back','← 返回策划')}${button('copy','打开纯复制页 →',true,p.stale.render||!p.output.html)}</div></section></div>`);
 on('draft',()=>{document.getElementById('audit').checked=false;document.getElementById('copy').disabled=true;},'input');
 bindQueue('studio');on('back',()=>nav('desk/'+p.id));
 on('save-draft',async()=>{await command(p,'save_draft',{markdown:document.getElementById('draft').value});render();notify('正文已保存，预览需要重新生成');});
 on('preview',async()=>{await command(p,'render',{markdown:document.getElementById('draft').value,audited:document.getElementById('audit').checked});render();});
 on('restore-draft',async()=>{await command(p,'restore_draft');render();});on('copy',()=>{window.open('/#/copy/'+p.id,'_blank','noopener');});

}
function render(){if(booting){app.innerHTML='<main>正在连接工作台…</main>';return;}if(cloudMode&&!connected){loginPage();return;}const [page]=route(),p=current();
if(cloudMode&&p?.partial){const error=projectLoadErrors.get(p.id);shell(`<div class="panel">${error?e(error):'正在读取选题…'}${error?button('reload-project','重新读取'):''}</div>`);if(error){on('reload-project',()=>{projectLoadErrors.delete(p.id);render();});return;}if(!projectLoads.has(p.id)){const task=cloud.call('projects.get',{id:p.id}).then(next=>{projects=projects.map(x=>x.id===next.id?next:x);}).catch(err=>projectLoadErrors.set(p.id,err.message)).finally(()=>{projectLoads.delete(p.id);render();});projectLoads.set(p.id,task);}return;}
if(page==='copy'){document.body.className='copy';app.innerHTML=p&&!p.stale.render&&p.output.html?renderArticle(p.plan.title,p.draft.markdown):'<p>预览尚未生成或已过期，请返回工作台更新。</p>';return;}if(page==='desk')desk(p);else if(page==='studio')studio(p);else pool();}
let loginError='';
function loginPage(){document.body.className='';app.innerHTML=`<main style="max-width:540px"><div class="eyebrow">WRITTER / SHANGHAI</div><h1>登录你的编辑工作台</h1><p class="muted">使用在 CloudBase 身份认证中创建的账号。</p><form id="login-form" class="panel"><label for="username">用户名</label><input id="username" type="text" autocomplete="username" required><label for="password">密码</label><input id="password" type="password" autocomplete="current-password" required style="width:100%;padding:13px;border:1px solid #dce2d9;border-radius:8px"><div class="toolbar"><button class="primary" type="submit">登录</button></div>${loginError?`<p class="notice">${e(loginError)}</p>`:''}</form>${uid?button('retry','重新连接'):''}</main>`;on('login-form',async ev=>{ev.preventDefault();const btn=document.querySelector('#login-form button');btn.disabled=true;btn.textContent='正在登录…';try{await cloud.login(document.getElementById('username').value.trim(),document.getElementById('password').value);await connect();loginError='';render();}catch(err){loginError=err.message;loginPage();}},'submit');on('retry',async()=>{try{await connect();loginError='';render();}catch(err){loginError=err.message;loginPage();}});}
window.addEventListener('hashchange',render);render();
if(cloudMode){try{if(await cloud.session())await connect();}catch(err){loginError=err.message;}finally{booting=false;render();}}

