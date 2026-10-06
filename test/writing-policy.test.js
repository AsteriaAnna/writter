import {test} from 'node:test';
import assert from 'node:assert/strict';
import {generateInitialDraft,validateWritingBrief} from '../src/writing-policy.js';
const brief={articleType:'event',title:'项目启用后，哪些效果仍待观察？',reader:'普通读者',readerQuestion:'启用与效果有何区别？',documents:[{id:'s',name:'原始资料',url:'https://example.com/source',text:'中心已启用，希望实现云端监测。'}],sections:[{title:'事情本身',purpose:'说明已发生的事',keyPoint:'中心启用',sourceIds:['s'],transition:'接着区分目标'},{title:'目标与效果',purpose:'解释边界',keyPoint:'监测仍是目标',sourceIds:['s'],transition:'回应启用不等于目标达成'}]};
const draft={status:'draft_ready',markdown:'中心已启用，云端监测仍是希望实现的目标。',gaps:[],coverage:[{section:1,sourceIds:['s']},{section:2,sourceIds:['s']}]};
test('event writing accepts no personal position; method writing requires an approved position and sources',()=>{
 assert.equal(validateWritingBrief(brief).articleType,'event');
 assert.throws(()=>validateWritingBrief({...brief,articleType:'method'}),/主张/);
 assert.throws(()=>validateWritingBrief({...brief,documents:[]}),/原始资料/);
 assert.throws(()=>validateWritingBrief({...brief,sections:[{...brief.sections[0],sourceIds:['invented']},brief.sections[1]]}),/来源 ID/);
});
test('insufficient evidence stops before review and preserves concrete gaps',async()=>{
 let count=0;const result=await generateInitialDraft({brief,ai:{configured:true,json:async()=>{count++;return{status:'needs_input',markdown:'',gaps:['缺少监测成效数据']}}}});
 assert.equal(count,1);assert.equal(result.qualityStatus,'needs_input');assert.equal(result.review,null);
});
test('draft survives review failure; API success is never labeled human quality approval',async()=>{
 let saved;let count=0;await assert.rejects(generateInitialDraft({brief,onDraft:x=>{saved=x},ai:{configured:true,json:async()=>{if(++count===1)return draft;throw Error('review timeout')}}}),/timeout/);
 assert.equal(saved.draft.markdown,draft.markdown);assert.equal(saved.qualityStatus,'unreviewed');
 count=0;const result=await generateInitialDraft({brief,ai:{configured:true,json:async()=>++count===1?draft:{summary:'未发现具体问题，待用户评阅',issues:[]}}});
 assert.equal(result.qualityStatus,'human_review_pending');
});
test('review must locate real prose and inventing a reference URL fails before review',async()=>{
 let count=0;await assert.rejects(generateInitialDraft({brief,ai:{configured:true,json:async()=>++count===1?draft:{summary:'需修改',issues:[{category:'facts',severity:'blocking',quote:'正文不存在的句子',reason:'扩大事实',suggestion:'收窄'}]}}}),/无法定位/);
 await assert.rejects(generateInitialDraft({brief,ai:{configured:true,json:async()=>({...draft,markdown:'[资料](https://invented.example/)'})}}),/资料之外/);
});
