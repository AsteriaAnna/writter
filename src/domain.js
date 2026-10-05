export const stages = ['selected','planning','plan_ready','draft_ready','preview_ready'];
export const safeUrl = value => { try { const u = new URL(value); return ['http:','https:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
export const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function normalizeFeed(data) {
  if (!Array.isArray(data.items)) throw new Error('上游 JSON 缺少 items 数组');
  return data.items.filter(x => x.id && x.title && safeUrl(x.url)).map(x => ({provider:'ai-news-aggregator',externalId:x.id,title:x.title_zh || x.title,summary:'',originalUrl:safeUrl(x.url),sourceName:x.source || x.site_name || '未知来源',publishedAt:x.published_at || x.first_seen_at,category:x.site_id || '其他'}));
}
export function createProject(candidate) {
  return {id:crypto.randomUUID(),revision:0,stage:'selected',candidate:structuredClone(candidate),evidence:{sources:[],notes:'',confirmed:false},plan:{title:candidate.title,angle:'',outline:''},draft:{markdown:''},visual:{assets:[]},output:{html:''},stale:{draft:true,visual:true,render:true},history:{plan:[],draft:[]},updatedAt:new Date().toISOString()};
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
export function renderArticle(title,markdown) {
  const body = markdown.split(/\n\s*\n/).filter(Boolean).map(block => block.startsWith('## ') ? `<h2 style="font-size:22px;color:#245746;margin:32px 0 16px">${escape(block.slice(3))}</h2>` : `<p style="margin:18px 0;line-height:1.9;font-size:16px">${escape(block).replace(/\n/g,'<br>')}</p>`).join('');
  return `<article style="max-width:680px;margin:auto;padding:32px 24px;color:#24372e;background:#fff;font-family:system-ui,sans-serif"><h1 style="font-size:30px;line-height:1.4">${escape(title)}</h1>${body}</article>`;
}
