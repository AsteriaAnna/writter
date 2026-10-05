import {normalizeFeed} from './domain.js';
const cache = new Map();
const TIMEOUT_MS = 10000;
// GitHub raw is intermittently unreachable from the Shanghai region; jsDelivr
// serves the same upstream file over a CDN. Both return identical real data.
const sources = window => [
  `https://raw.githubusercontent.com/SuYxh/ai-news-aggregator/main/data/latest-${window}.json`,
  `https://cdn.jsdelivr.net/gh/SuYxh/ai-news-aggregator@main/data/latest-${window}.json`,
];
// Hard timeout via Promise.race: AbortSignal can miss a blackholed DNS/connect,
// so bound the whole fetch regardless and abort the controller on deadline.
async function fetchJson(url, ms) {
  const controller = new AbortController();
  let timer;
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => { controller.abort(); reject(new Error('上游超时')); }, ms);
  });
  try {
    const response = await Promise.race([fetch(url, {signal: controller.signal}), deadline]);
    if (!response.ok) throw new Error(`上游返回 ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}
export async function feed(window='24h') {
  if (!['24h','7d'].includes(window)) throw new Error('无效时间范围');
  const cached=cache.get(window);
  if(cached && Date.now()-cached.time<300000)return cached.data;
  let lastErr;
  for (const url of sources(window)) {
    try {
      const source = await fetchJson(url, TIMEOUT_MS);
      const data = {items:normalizeFeed(source),generatedAt:source.generated_at,providers:[{name:'AI News Aggregator',status:'ok'},{name:'AIHOT',status:'pending',message:'独立 API 尚待验证'}]};
      cache.set(window,{time:Date.now(),data});return data;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error('热点源不可达');
}
