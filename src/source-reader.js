import https from 'node:https';
import {lookup} from 'node:dns/promises';
import {isIP} from 'node:net';
export function isPublicAddress(ip){
 if(isIP(ip)===4){const [a,b]=ip.split('.').map(Number);return !(a===0||a===10||a===127||a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&[0,168].includes(b)||a===100&&b>=64&&b<=127||a===198&&[18,19].includes(b)||a>=224);}
 // Allow only global unicast IPv6; excludes mapped IPv4, loopback and private ranges.
 return isIP(ip)===6&&/^[23][0-9a-f]{0,3}:/i.test(ip)&&!/^2001:(db8|0):/i.test(ip)&&!/^2002:/i.test(ip);
}
export function extractText(html){
 return html.replace(/<(script|style|nav|footer|header)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'").replace(/\s+/g,' ').trim();
}
async function read(url,redirects=0,signal){
 if(signal?.aborted)throw Error('来源读取超时');
 const u=new URL(url);
 if(u.protocol!=='https:'||u.username||u.password||u.port&&u.port!=='443')throw Error('来源仅支持公开 HTTPS 链接');
 const hostname=u.hostname.replace(/^\[|\]$/g,'');
 const addresses=isIP(hostname)?[{address:hostname,family:isIP(hostname)}]:await lookup(hostname,{all:true});
 if(!addresses.length||addresses.some(x=>!isPublicAddress(x.address)))throw Error('来源地址不可访问');
 if(signal?.aborted)throw Error('来源读取超时');
 const chosen=addresses[0];
 return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>{req.destroy(Error('来源读取超时'));},12000);
  const req=https.get(u,{signal,headers:{'User-Agent':'Writter/0.3 (editorial source reader)','Accept':'text/html,text/plain'},lookup:(_host,options,cb)=>cb(null,options.all?[chosen]:chosen.address,chosen.family)},res=>{
   if([301,302,303,307,308].includes(res.statusCode)){
    res.resume();clearTimeout(timer);if(redirects>=2||!res.headers.location)return reject(Error('来源重定向过多'));
    read(new URL(res.headers.location,u).href,redirects+1,signal).then(resolve,reject);return;
   }
   if(res.statusCode!==200||!/^text\/(html|plain)/i.test(res.headers['content-type']||'')){res.resume();clearTimeout(timer);reject(Error('来源没有可读取的正文'));return;}
   const chunks=[];let bytes=0;
   res.on('data',chunk=>{bytes+=chunk.length;if(bytes>512000){req.destroy(Error('来源页面过大'));return;}chunks.push(chunk);});
   res.on('error',reject);
   res.on('end',()=>{clearTimeout(timer);const text=extractText(Buffer.concat(chunks).toString('utf8'));if(text.length<80)return reject(Error('来源正文过短'));resolve({url:u.href,text});});
  });
  req.on('error',err=>{clearTimeout(timer);reject(err);});
 });
}
export async function readSource(url){
 const controller=new AbortController();let timer;
 const deadline=new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(Error('来源读取超时'));},20000);timer.unref();});
 try{return await Promise.race([read(url,0,controller.signal),deadline]);}
 finally{clearTimeout(timer);controller.abort();}
}
