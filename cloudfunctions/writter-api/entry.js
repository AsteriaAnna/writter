import cloudbase from '@cloudbase/node-sdk';
import {makeHandler} from '../../src/cloud-api.js';
import {feed} from '../../src/feed.js';
import {createPgRepo} from '../../src/pg-repo.js';

const ENV='writter-dev-d0g7h1prq4ce60665';
const app=cloudbase.init({env:ENV,region:'ap-shanghai',timeout:15000});

function getRdb() {
  return app.rdb({
    instance: process.env.WRITTER_RDB_INSTANCE || 'postgres-k8lowqlc',
    database: process.env.WRITTER_RDB_DATABASE || 'public',
  });
}

export const main=async event=>{
  return makeHandler({repo:createPgRepo(getRdb()),getIdentity:()=>app.auth().getUserInfo(),allowedUids:(process.env.WRITTER_ALLOWED_UIDS || '').split(',').map(x=>x.trim()).filter(Boolean),loadFeed:feed})(event);
};
