const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const https = require('node:https');
const Module = require('node:module');

const indexPath = require.resolve('../cloudfunctions/healthNews/index');
const cached = [{ title: '最近缓存', url: 'https://www.chinanews.com.cn/jk/cache.shtml', publishedAt: '2026-07-14T00:00:00Z' }];

test('returns the cache when an RSS response errors after its headers', async () => {
  const originalGet = https.get;
  const originalLoad = Module._load;
  const fakeCloud = {
    DYNAMIC_CURRENT_ENV: 'current',
    init: () => {},
    database: () => ({
      collection: (name) => {
        assert.equal(name, 'health_news_cache');
        return {
          doc: (id) => {
            assert.equal(id, 'latest');
            return {
              get: async () => ({ data: { items: cached, refreshedAt: '2026-07-14T01:00:00.000Z' } }),
              set: async () => { throw new Error('不应写缓存'); }
            };
          }
        };
      }
    })
  };

  https.get = (url, options, onResponse) => {
    assert.equal(url, 'https://www.chinanews.com.cn/rss/jk.xml');
    assert.equal(options.timeout, 8000);
    const request = new EventEmitter();
    request.destroy = (error) => request.emit('error', error);
    const response = new EventEmitter();
    response.statusCode = 200;
    response.setEncoding = () => {};
    response.resume = () => {};
    response.on('error', () => {});
    onResponse(response);
    queueMicrotask(() => response.emit('error', new Error('连接中断')));
    return request;
  };
  Module._load = function load(request, parent, isMain) {
    if (request === 'wx-server-sdk') return fakeCloud;
    return originalLoad.call(this, request, parent, isMain);
  };
  delete require.cache[indexPath];

  try {
    const { main } = require(indexPath);
    const result = await Promise.race([
      main(),
      new Promise((resolve) => setTimeout(() => resolve({ timedOut: true }), 50))
    ]);
    assert.deepEqual(result, { items: cached, source: 'cache', refreshedAt: '2026-07-14T01:00:00.000Z' });
  } finally {
    https.get = originalGet;
    Module._load = originalLoad;
    delete require.cache[indexPath];
  }
});
