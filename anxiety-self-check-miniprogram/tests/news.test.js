const test = require('node:test');
const assert = require('node:assert/strict');
const { isAllowedArticleUrl, normalizeNewsResult } = require('../utils/news');

test('normalizes only safe news metadata returned by the cloud function', () => {
  assert.equal(isAllowedArticleUrl('https://health.chinanews.com.cn/jk/a.shtml'), true);
  assert.equal(isAllowedArticleUrl('https://example.com/a'), false);
  assert.deepEqual(normalizeNewsResult({
    items: [
      { title: '心理健康资讯', url: 'https://www.chinanews.com.cn/jk/a.shtml', publishedAt: '2026-07-15T00:00:00Z' },
      { title: 'bad', url: 'https://example.com/a', publishedAt: '2026-07-15T00:00:00Z' }
    ],
    source: 'cache',
    refreshedAt: '2026-07-15T01:00:00Z'
  }), {
    items: [{ title: '心理健康资讯', url: 'https://www.chinanews.com.cn/jk/a.shtml', publishedAt: '2026-07-15T00:00:00Z' }],
    source: 'cache',
    refreshedAt: '2026-07-15T01:00:00Z'
  });
});

test('rejects an empty or malformed news result', () => {
  assert.throws(() => normalizeNewsResult({ items: [], source: 'live' }), /暂无可展示的健康资讯/);
});
