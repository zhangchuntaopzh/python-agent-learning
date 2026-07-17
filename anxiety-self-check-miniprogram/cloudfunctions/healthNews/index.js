const https = require('node:https');
const cloud = require('wx-server-sdk');
const { getHealthNews } = require('./service');

const FEED_URL = 'https://www.chinanews.com.cn/rss/jk.xml';
const CACHE_COLLECTION = 'health_news_cache';
const CACHE_ID = 'latest';

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { timeout: 8000, headers: { 'User-Agent': 'AnxietySelfCheck/1.0' } }, (response) => {
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`RSS 请求失败：${response.statusCode}`));
        return;
      }
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => resolve(body));
      response.on('error', reject);
    });
    request.on('timeout', () => request.destroy(new Error('RSS 请求超时')));
    request.on('error', reject);
  });
}

async function readCache() {
  const result = await db.collection(CACHE_COLLECTION).doc(CACHE_ID).get();
  return result.data;
}

function writeCache(value) {
  return db.collection(CACHE_COLLECTION).doc(CACHE_ID).set({ data: value });
}

exports.main = () => getHealthNews({
  fetchRss: () => fetchText(FEED_URL),
  readCache,
  writeCache,
  now: () => new Date()
});
