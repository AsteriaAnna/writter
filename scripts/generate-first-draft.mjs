// Explicit paid execution in an environment where WRITTER_AI_KEY is configured.
// No credential files, CloudBase deployment or production database writes.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createAI} from '../src/ai.js';
import {generateInitialDraft} from '../src/writing-policy.js';
const [inputPath,outputPath]=process.argv.slice(2);
if(!inputPath||!outputPath){console.error('用法：node scripts/generate-first-draft.mjs <确认资料与大纲.json> <新输出目录>');process.exit(1);}
if(!process.env.WRITTER_AI_KEY){console.error('当前环境无模型密钥。请在已有安全配置的环境运行，不要在聊天或仓库中提供密钥。');process.exit(1);}
const brief=JSON.parse(await readFile(resolve(inputPath),'utf8'));
const out=resolve(outputPath);await mkdir(out,{recursive:false});
const saveDraft=async result=>{
 await writeFile(join(out,'result.json'),JSON.stringify(result,null,2));
 await writeFile(join(out,'draft.md'),result.draft.markdown);
};
try{
 const result=await generateInitialDraft({ai:createAI(),brief,onDraft:saveDraft});
 await saveDraft(result);
 console.log('执行完成：'+result.qualityStatus+'；请阅读 draft.md 与 result.json，模型审校不等于人工质量通过。');
}catch(err){console.error('执行失败：'+err.message+'；若 draft.md 已生成，初稿已保留。');process.exitCode=1;}
