import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {feed} from './src/feed.js';
export {feed};
const root = fileURLToPath(new URL('./',import.meta.url));
const files={'/':'public/index.html','/app.js':'public/app.js','/style.css':'public/style.css','/workflow.js':'src/workflow.js','/domain.js':'src/domain.js','/config.js':'public/config.js','/cloud-client.js':'public/cloud-client.js','/vendor/cloudbase.js':'public/vendor/cloudbase.js'};
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

