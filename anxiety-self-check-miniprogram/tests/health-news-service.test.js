const test = require('node:test');
const assert = require('node:assert/strict');
const { getHealthNews } = require('../cloudfunctions/healthNews/service');

const rss = '<rss><channel><item><title>睡眠与情绪</title><link>https://www.chinanews.com.cn/jk/a.shtml</link><pubDate>2026-07-15T00:00:00Z</pubDate></item></channel></rss>';
const cached = [{ title: '最近缓存', url: 'https://www.chinanews.com.cn/jk/cache.shtml', publishedAt: '2026-07-14T00:00:00Z' }];

test('refreshes RSS metadata and writes only the selected entries to cache', async () => {
  let written;
  const result = await getHealthNews({
    fetchRss: async () => rss,
    readCache: async () => { throw new Error('不应读取缓存'); },
    writeCache: async (value) => { written = value; },
    now: () => new Date('2026-07-15T01:00:00Z')
  });
  assert.equal(result.source, 'live');
  assert.equal(result.items.length, 1);
  assert.deepEqual(written, { items: result.items, refreshedAt: '2026-07-15T01:00:00.000Z' });
});

test('returns a previous cache when RSS loading fails and rejects a first failure', async () => {
  const fromCache = await getHealthNews({
    fetchRss: async () => { throw new Error('超时'); },
    readCache: async () => ({ items: cached, refreshedAt: '2026-07-14T01:00:00.000Z' }),
    writeCache: async () => { throw new Error('不应写缓存'); },
    now: () => new Date('2026-07-15T01:00:00Z')
  });
  assert.deepEqual(fromCache, { items: cached, source: 'cache', refreshedAt: '2026-07-14T01:00:00.000Z' });
  await assert.rejects(() => getHealthNews({
    fetchRss: async () => { throw new Error('超时'); },
    readCache: async () => { throw new Error('没有缓存'); },
    writeCache: async () => {},
    now: () => new Date('2026-07-15T01:00:00Z')
  }), /无法加载健康资讯/);
});
