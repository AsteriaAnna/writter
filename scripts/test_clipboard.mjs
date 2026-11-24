// Runs the actual copy helper with mocked APIs. Not a rendering/OS clipboard test.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const page=fs.readFileSync(new URL('../examples/gallery.html',import.meta.url),'utf8');
const script=page.match(/<script>([\s\S]*?)<\/script>/)[1];

async function check({api=true,reject=false,legacy=true}={}) {
  const target={nodeType:1,innerHTML:'<section><p><span leaf="">中文 &amp; HTML</span></p></section>',innerText:'中文 & HTML'};
  const status={textContent:''};const writes=[];let eventHandler;let fallbackData;let selected=false;
  const selection={removeAllRanges(){selected=false;},addRange(){selected=true;}};
  const document={
    querySelectorAll(){return [];},getElementById(){return {addEventListener(){}};},
    createRange(){return {selectNodeContents(node){assert.equal(node,target,'fallback must select a real target, not a plain HTML descriptor');}};},
    addEventListener(name,callback){eventHandler=callback;},removeEventListener(){eventHandler=null;},
    execCommand(){if(legacy==='throw')throw Error('blocked');if(!legacy)return false;fallbackData={};eventHandler({clipboardData:{setData(k,v){fallbackData[k]=v;}},preventDefault(){}});return true;},
  };
  class ClipboardItem{constructor(data){this.data=data;}}
  const ctx=vm.createContext({document,window:{ClipboardItem,getSelection(){return selection;}},ClipboardItem,Blob,
    navigator:api?{clipboard:{async write(items){if(reject)throw Error('permission');writes.push(items[0].data);}}}:{},target,status});
  vm.runInContext(script,ctx);
  await vm.runInContext('copyHTML(target,status)',ctx);
  assert.ok(eventHandler == null,'copy listener must be cleaned');
  if(api&&!reject){assert.equal(await writes[0]['text/html'].text(),target.innerHTML);assert.equal(await writes[0]['text/plain'].text(),target.innerText);}
  else if(legacy&&legacy!=='throw'){assert.equal(fallbackData['text/html'],target.innerHTML);assert.equal(fallbackData['text/plain'],target.innerText);}
  else {assert.ok(selected);assert.match(status.textContent,/Ctrl\+C/);}
}
await check();console.log('PASS modern HTML/plain-text MIME output');
await check({api:false});console.log('PASS missing modern API uses HTML copy event');
await check({reject:true});console.log('PASS denied permission uses fallback');
await check({api:false,legacy:false});console.log('PASS manual copy keeps DOM selection');
await check({api:false,legacy:'throw'});console.log('PASS throwing fallback cleans listener and preserves selection');
console.log('5 mocked clipboard cases passed; not WeChat or browser acceptance.');
