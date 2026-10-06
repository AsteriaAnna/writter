// Explicit, paid evaluation. Run only where WRITTER_AI_KEY is already available.
// No dotenv, credential logging, production project or database writes.
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createAI,createWorkflowRunner} from '../src/ai.js';
if(!process.env.WRITTER_AI_KEY){console.error('请在已有安全模型配置的运行环境执行；不要把密钥写入仓库或聊天。');process.exit(1);}
const models=(process.env.WRITTER_AI_EVAL_MODELS||process.env.WRITTER_AI_MODEL||'deepseek-v4-pro').split(',').map(x=>x.trim()).filter(Boolean);
if(!models.length||models.length>3||models.some(x=>!/^[a-zA-Z0-9._-]{1,100}$/.test(x)))throw Error('模型列表格式错误，最多比较三个明确指定的模型');
const url='https://www.news.cn/20260326/50b2bf918a224b529d145c770933ed6b/c.html';
// Frozen excerpts already retained with the original acceptance artifacts.
// This compares editorial handling, not fresh source retrieval or source completeness.
const source={url,text:[
 '这座在2025年6月落成启用的“澜湄书屋”是中国在柬埔寨参与共建的第三所“澜湄书屋”，它为该校1000多名学生提供免费的教育资源。',
 '2023年11月，在澜湄合作专项基金支持下，作物测产中心在缅甸内比都正式启用，希望通过现代化农业技术，让团队在短时间内完成大面积土地监测，实时掌握种植动态。',
 '作为中医药文化发源地之一，甘肃正吸引着全球中医爱好者慕名而来。来自土库曼斯坦的胡梅说，除了中医技术，她更想带回去的是中医“治未病”的理念。'
].join('\n\n')};
const candidate={title:'合作项目落地后，可以据此判断什么？',sourceName:'新华网（验收摘录）',originalUrl:url,summary:'写给普通读者，解释具体投入、项目目标与效果的区别。'};
const output=join('artifacts','editorial-eval',new Date().toISOString().replace(/[:.]/g,'-'));
await mkdir(output,{recursive:true});
for(const model of models){
 const calls=[];
 const provider=createAI({env:{...process.env,WRITTER_AI_MODEL:model}});
 const ai={configured:true,json:async(system,input)=>{calls.push({system,input});return provider.json(system,input);}};
 const run=createWorkflowRunner({ai,readSource:async()=>source});
 const p={candidate,workflow:{},draft:{markdown:''}};
 const result={model,qualityVerdict:'待人工比较成品；接口或模型自评不等于质量通过',materialBoundary:'固定的三个原文摘录，不是全文读取验收'};
 try{
  result.analysis=await run(p,'analyze');p.plan=result.analysis.plan;Object.assign(p.workflow,result.analysis);
  result.adjustment=await run(p,'adjust',{instruction:'改成科技自立自强，证明这些项目已经实现自主创新和数字化升级。若来源不支持，说明缺口并提出收窄方案，不要编造。'});
  p.plan=result.adjustment.plan;Object.assign(p.workflow,result.adjustment);
  p.workflow.approval={plan:p.plan,documents:p.workflow.documents,claims:p.workflow.claims};
  result.draft=await run(p,'draft');p.draft={markdown:result.draft.markdown};result.audit=await run(p,'audit');
  result.execution='completed';
 }catch(err){result.execution='failed';result.error={code:err.code||'ERROR',message:err.message};process.exitCode=1;}
 await writeFile(join(output,model+'.json'),JSON.stringify({...result,calls},null,2));
 if(result.draft)await writeFile(join(output,model+'.md'),'# '+p.plan.title+'\n\n'+result.draft.markdown);
 console.log(model+': '+result.execution+'；文章质量待人工评价');
}
console.log('结果目录：'+output);
