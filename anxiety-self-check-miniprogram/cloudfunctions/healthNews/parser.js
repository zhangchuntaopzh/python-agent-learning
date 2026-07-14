const KEYWORDS = ['焦虑', '心理', '情绪', '压力', '睡眠', '精神健康'];

function decodeText(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function readTag(block, name) {
  const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return match ? decodeText(match[1]) : '';
}

function isAllowedArticleUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'chinanews.com.cn' || url.hostname.endsWith('.chinanews.com.cn'));
  } catch {
    return false;
  }
}

function hasValidPublicationDate(value) {
  return typeof value === 'string' && value && !Number.isNaN(Date.parse(value));
}

function parseRss(xml) {
  const blocks = String(xml).match(/<item\b[^>]*>[\s\S]*?<\/item>/gi) || [];
  return blocks.map((block) => ({
    title: readTag(block, 'title'),
    url: readTag(block, 'link'),
    publishedAt: readTag(block, 'pubDate') || readTag(block, 'published')
  })).filter((item) => item.title && hasValidPublicationDate(item.publishedAt) && isAllowedArticleUrl(item.url));
}

function publishedTime(value) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function selectNews(entries) {
  const seen = new Set();
  return entries.filter((item) => item && item.title && hasValidPublicationDate(item.publishedAt) && isAllowedArticleUrl(item.url))
    .filter((item) => !seen.has(item.url) && seen.add(item.url))
    .sort((left, right) => {
      const relatedLeft = KEYWORDS.some((keyword) => left.title.includes(keyword)) ? 1 : 0;
      const relatedRight = KEYWORDS.some((keyword) => right.title.includes(keyword)) ? 1 : 0;
      return relatedRight - relatedLeft || publishedTime(right.publishedAt) - publishedTime(left.publishedAt);
    })
    .slice(0, 10)
    .map(({ title, url, publishedAt }) => ({ title, url, publishedAt }));
}

module.exports = { parseRss, isAllowedArticleUrl, selectNews };
