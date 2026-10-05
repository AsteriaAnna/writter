import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {normalizeFeed} from './src/domain.js';
const root = fileURLToPath(new URL('./',import.meta.url));
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
const files={'/':'public/index.html','/app.js':'public/app.js','/style.css':'public/style.css','/domain.js':'src/domain.js'};
export const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='GET'){res.writeHead(405);res.end();return;}
  if(url.pathname==='/api/feed'){
    res.setHeader('Content-Type','application/json; charset=utf-8');
    try{res.end(JSON.stringify(await feed(url.searchParams.get('window') || '24h')));}catch(e){res.writeHead(502);res.end(JSON.stringify({error:e.message,items:[]}));}return;
  }
  const path=files[url.pathname];
  if(!path){res.writeHead(404);res.end('Not found');return;}
  try{res.setHeader('Content-Type',path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':'text/html; charset=utf-8');res.end(await readFile(root+path));}catch{res.writeHead(500);res.end('Unable to serve file');}
});
if(process.argv[1]===fileURLToPath(import.meta.url))server.listen(Number(process.env.PORT || 3000),'0.0.0.0',()=>console.log('Writter: http://localhost:3000'));
