import {test} from 'node:test';
import assert from 'node:assert/strict';
import {server} from '../server.mjs';
test('HTTP service serves modules, rejects writes and arbitrary paths',async()=>{await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));try{const base='http://127.0.0.1:'+server.address().port;assert.equal((await fetch(base+'/')).status,200);assert.equal((await fetch(base+'/domain.js')).headers.get('content-type'),'text/javascript');assert.equal((await fetch(base+'/.env')).status,404);assert.equal((await fetch(base+'/api/feed',{method:'POST'})).status,405);}finally{await new Promise(resolve=>server.close(resolve));}});
