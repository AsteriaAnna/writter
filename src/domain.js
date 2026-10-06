export const stages = ['selected','planning','plan_ready','draft_ready','preview_ready'];
export const safeUrl = value => { try { const u = new URL(value); return ['http:','https:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
export const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function normalizeFeed(data) {
  if (!Array.isArray(data.items)) throw new Error('上游 JSON 缺少 items 数组');
  return data.items.filter(x => x.id && x.title && safeUrl(x.url)).map(x => ({provider:'ai-news-aggregator',externalId:x.id,title:x.title_zh || x.title,summary:typeof x.summary==='string'?x.summary.slice(0,5000):'',originalUrl:safeUrl(x.url),sourceName:x.source || x.site_name || '未知来源',publishedAt:x.published_at || x.first_seen_at,category:x.site_id || '其他'}));
}
export function createProject(candidate,id=globalThis.crypto.randomUUID()) {
  return {id,revision:0,stage:'selected',candidate:structuredClone(candidate),evidence:{sources:[],notes:'',confirmed:false},plan:{title:candidate.title,angle:'',outline:''},draft:{markdown:''},visual:{assets:[]},output:{html:''},stale:{draft:true,visual:true,render:true},history:{plan:[],draft:[]},updatedAt:new Date().toISOString()};
}
export function revise(project,module,value) {
  const p = structuredClone(project);
  if (!['plan','draft','evidence'].includes(module)) throw new Error('未知模块');
  if (JSON.stringify(p[module]) === JSON.stringify(value)) return p;
  if (p.history[module]) p.history[module] = [...p.history[module],structuredClone(p[module])].slice(-3);
  p[module] = structuredClone(value);
  if (module === 'plan' || module === 'evidence') {p.stale={draft:true,visual:true,render:true};p.stage='planning';}
  if (module === 'draft') {p.stale.visual=true;p.stale.render=true;p.stage='draft_ready';}
  p.revision++;p.updatedAt=new Date().toISOString();return p;
}
export function approvePlan(p) {
  if (!p.evidence.confirmed || !p.evidence.sources.length) throw new Error('请添加来源，并确认资料核验');
  if (!p.plan.title.trim() || !p.plan.angle.trim() || !p.plan.outline.trim()) throw new Error('请填写标题、角度和结构');
  return {...p,stage:'plan_ready'};
}
// Deterministic text renderer: raw HTML is escaped. No model writes HTML.
function inline(text) {
 const escaped=escape(text).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
 return escaped.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g,(_,label,url)=>{const safe=safeUrl(url.replace(/&amp;/g,'&'));return safe?`<a href="${escape(safe)}" style="color:#285c49;text-decoration:underline" target="_blank" rel="noopener noreferrer">${label}</a>`:label;});
}
export function renderArticle(title,markdown) {
 const body=markdown.split(/\n\s*\n/).filter(Boolean).map(block=>{
  if(/^#{1,3} /.test(block))return `<h2 style="font-size:22px;line-height:1.5;color:#245746;margin:30px 0 14px">${inline(block.replace(/^#{1,3} /,''))}</h2>`;
  const lines=block.split('\n');
  if(lines.every(x=>/^[-*] /.test(x)))return `<ul style="padding-left:24px;line-height:1.9">${lines.map(x=>`<li style="margin:8px 0">${inline(x.slice(2))}</li>`).join('')}</ul>`;
  if(lines.every(x=>/^\d+\. /.test(x)))return `<ol style="padding-left:24px;line-height:1.9">${lines.map(x=>`<li style="margin:8px 0">${inline(x.replace(/^\d+\. /,''))}</li>`).join('')}</ol>`;
  if(block.startsWith('> '))return `<blockquote style="margin:20px 0;padding:12px 18px;border-left:3px solid #285c49;background:#f3f6f0;line-height:1.9">${inline(block.replace(/^> /gm,'')).replace(/\n/g,'<br>')}</blockquote>`;
  return `<p style="margin:18px 0;line-height:1.9;font-size:16px">${inline(block).replace(/\n/g,'<br>')}</p>`;
 }).join('');
 return `<article style="max-width:680px;margin:auto;padding:32px 24px;color:#24372e;background:#fff;font-family:system-ui,sans-serif;overflow-wrap:anywhere"><h1 style="font-size:30px;line-height:1.4;margin:0 0 24px">${escape(title)}</h1>${body}</article>`;
}

export function applyProjectAction(project,action,payload={}) {
  let p=structuredClone(project);
  if(action==='save_plan' || action==='approve_plan') {
    p=revise(p,'evidence',payload.evidence);
    p=revise(p,'plan',payload.plan);
    if(action==='approve_plan')p=approvePlan(p);
  } else if(action==='save_draft' || action==='render') {
    const ready=p.stage==='plan_ready'||(!p.stale.draft&&['draft_ready','preview_ready'].includes(p.stage));
    if(!ready)throw new Error('策划已过期，请先重新确认');
    if(!payload.markdown?.trim())throw new Error('请先填写正文');
    p=revise(p,'draft',{markdown:payload.markdown});
    p.stale.draft=false;p.stage='draft_ready';
    if(action==='render') {
      if(payload.audited!==true)throw new Error('请先复查当前正文的事实与来源');
      p.output.html=renderArticle(p.plan.title,p.draft.markdown);
      p.stale.render=false;p.stage='preview_ready';
      p.draft.auditedAt=new Date().toISOString();
    }
  } else if(action==='restore_plan' || action==='restore_draft') {
    const module=action==='restore_plan'?'plan':'draft';
    const previous=p.history[module].at(-1);
    if(!previous)throw new Error('没有可恢复的版本');
    p=revise(p,module,previous);
  } else throw new Error('未知操作');
  // Exactly one persisted revision per command, including approval and rendering.
  p.revision=project.revision+1;
  p.updatedAt=new Date().toISOString();
  return p;
}
