import cloudbase from '@cloudbase/node-sdk';
import {makeHandler} from '../../src/cloud-api.js';
import {feed} from '../../src/feed.js';
const ENV='writter-dev-d0g7h1prq4ce60665';
const app=cloudbase.init({env:ENV,region:'ap-shanghai',timeout:15000});
export const main=async event=>makeHandler({db:app.database(),getIdentity:()=>app.auth().getUserInfo(),allowedUids:(process.env.WRITTER_ALLOWED_UIDS || '').split(',').map(x=>x.trim()).filter(Boolean),loadFeed:feed})(event);
