import {normalizeFeed} from './domain.js';
const cache = new Map();
export async function feed(window='24h') {
  if (!['24h','7d'].includes(window)) throw new Error('无效时间范围');
  const cached=cache.get(window);
  if(cached && Date.now()-cached.time<300000)return cached.data;
  const response=await fetch(`https://raw.githubusercontent.com/SuYxh/ai-news-aggregator/main/data/latest-${window}.json`,{signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw new Error(`上游返回 ${response.status}`);
  const source=await response.json();
  const data={items:normalizeFeed(source),generatedAt:source.generated_at,providers:[{name:'AI News Aggregator',status:'ok'},{name:'AIHOT',status:'pending',message:'独立 API 尚待验证'}]};
  cache.set(window,{time:Date.now(),data});return data;
}
