import {config} from './config.js';
let appPromise;
async function getApp(){return appPromise ||= import('./vendor/cloudbase.js').then(({default:cloudbase})=>cloudbase.init({env:config.env,region:config.region,timeout:20000}));}
export async function session(){const app=await getApp();const {data,error}=await app.auth.getSession();if(error)throw new Error(error.message);return data?.session || null;}
export async function login(username,password){const app=await getApp();const {data,error}=await app.auth.signInWithPassword({username,password});if(error)throw new Error(error.message);if(!data?.session)throw new Error('登录未完成，请检查账号设置');return data.session;}
export async function logout(){const app=await getApp();const {error}=await app.auth.signOut();if(error)throw new Error(error.message);}
export async function call(action,data={}){const app=await getApp();const res=await app.callFunction({name:config.functionName,data:{...data,action}});const result=typeof res.result==='string'?JSON.parse(res.result):res.result;if(!result?.ok)throw Object.assign(new Error(result?.error?.message || res.message || '云函数未返回有效结果'),{code:result?.error?.code || res.code});return result.data;}
