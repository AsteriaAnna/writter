import {test} from 'node:test';
import assert from 'node:assert/strict';
import {feed} from '../src/feed.js';

test('feed falls back to jsDelivr when GitHub raw fails',async()=>{
  const calls=[];const real=globalThis.fetch;
  globalThis.fetch=async url=>{calls.push(url);
    if(String(url).startsWith('https://raw.githubusercontent.com'))throw new Error('fetch failed');
    return {ok:true,json:async()=>({generated_at:'t',items:[{id:'1',title:'Title',url:'https://example.com',source:'S'}]})};
  };
  try{
    const data=await feed('24h');
    assert.equal(data.items.length,1);
    assert.equal(calls.length,2);
    assert.ok(calls[0].startsWith('https://raw.githubusercontent.com'));
    assert.ok(calls[1].startsWith('https://cdn.jsdelivr.net'));
  }finally{globalThis.fetch=real;}
});

test('feed uses primary source when it succeeds',async()=>{
  const calls=[];const real=globalThis.fetch;
  globalThis.fetch=async url=>{calls.push(url);
    return {ok:true,json:async()=>({generated_at:'t',items:[{id:'1',title:'Title',url:'https://example.com',source:'S'}]})};
  };
  try{
    const data=await feed('7d');
    assert.equal(data.items.length,1);
    assert.equal(calls.length,1);
    assert.ok(calls[0].startsWith('https://raw.githubusercontent.com'));
  }finally{globalThis.fetch=real;}
});
