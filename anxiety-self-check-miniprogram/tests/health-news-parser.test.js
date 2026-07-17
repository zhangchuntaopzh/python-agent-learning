const test = require('node:test');
const assert = require('node:assert/strict');
const { parseRss, isAllowedArticleUrl, selectNews } = require('../cloudfunctions/healthNews/parser');

const rss = `<?xml version="1.0"?><rss><channel>
  <item><title><![CDATA[睡眠与情绪管理]]></title><link>https://www.chinanews.com.cn/jk/2026/01-02/1.shtml</link><pubDate>2026-01-02T10:00:00Z</pubDate></item>
  <item><title>普通健康资讯</title><link>https://health.chinanews.com.cn/jk/2026/01-03/2.shtml</link><pubDate>2026-01-03T10:00:00Z</pubDate></item>
  <item><title>无效链接</title><link>http://example.com/a</link><pubDate>2026-01-04T10:00:00Z</pubDate></item>
</channel></rss>`;

test('parses only title, date and allowed ChinaNews HTTPS links', () => {
  assert.deepEqual(parseRss(rss), [
    { title: '睡眠与情绪管理', url: 'https://www.chinanews.com.cn/jk/2026/01-02/1.shtml', publishedAt: '2026-01-02T10:00:00Z' },
    { title: '普通健康资讯', url: 'https://health.chinanews.com.cn/jk/2026/01-03/2.shtml', publishedAt: '2026-01-03T10:00:00Z' }
  ]);
  assert.equal(isAllowedArticleUrl('https://www.chinanews.com.cn/a'), true);
  assert.equal(isAllowedArticleUrl('http://www.chinanews.com.cn/a'), false);
});

test('rejects RSS entries with missing or unparseable publication dates', () => {
  const invalidDates = `<?xml version="1.0"?><rss><channel>
    <item><title>无法解析日期</title><link>https://www.chinanews.com.cn/jk/a.shtml</link><pubDate>not-a-date</pubDate></item>
    <item><title>缺少日期</title><link>https://www.chinanews.com.cn/jk/b.shtml</link></item>
    <item><title>有效日期</title><link>https://www.chinanews.com.cn/jk/c.shtml</link><published>Wed, 15 Jul 2026 10:00:00 GMT</published></item>
  </channel></rss>`;

  assert.deepEqual(parseRss(invalidDates), [
    { title: '有效日期', url: 'https://www.chinanews.com.cn/jk/c.shtml', publishedAt: 'Wed, 15 Jul 2026 10:00:00 GMT' }
  ]);
});

test('prioritizes related news, removes duplicates and caps results at ten', () => {
  const entries = Array.from({ length: 12 }, (_, index) => ({
    title: index === 11 ? '焦虑相关资讯' : `健康资讯 ${index}`,
    url: `https://www.chinanews.com.cn/jk/2026/01-0${(index % 9) + 1}/${index}.shtml`,
    publishedAt: `2026-01-${String((index % 9) + 1).padStart(2, '0')}T10:00:00Z`
  }));
  const result = selectNews([...entries, entries[0]]);
  assert.equal(result.length, 10);
  assert.equal(result[0].title, '焦虑相关资讯');
  assert.equal(new Set(result.map((item) => item.url)).size, 10);
});

test('does not display or rank entries with unparseable dates', () => {
  const result = selectNews([
    { title: '焦虑资讯', url: 'https://www.chinanews.com.cn/jk/invalid.shtml', publishedAt: 'not-a-date' },
    { title: '普通资讯', url: 'https://www.chinanews.com.cn/jk/valid.shtml', publishedAt: '2026-07-15T00:00:00Z' }
  ]);

  assert.deepEqual(result, [
    { title: '普通资讯', url: 'https://www.chinanews.com.cn/jk/valid.shtml', publishedAt: '2026-07-15T00:00:00Z' }
  ]);
});
