function isAllowedArticleUrl(value) {
  return typeof value === 'string' && /^https:\/\/(?:[a-z0-9-]+\.)*chinanews\.com\.cn(?:\/|$)/i.test(value);
}

function normalizeNewsResult(result) {
  const rawItems = result && Array.isArray(result.items) ? result.items : [];
  const items = rawItems.filter((item) => item && typeof item.title === 'string' && item.title.trim() && typeof item.publishedAt === 'string' && item.publishedAt && isAllowedArticleUrl(item.url))
    .slice(0, 10)
    .map((item) => ({ title: item.title.trim(), url: item.url, publishedAt: item.publishedAt }));
  if (items.length === 0) throw new Error('暂无可展示的健康资讯');
  return {
    items,
    source: result.source === 'cache' ? 'cache' : 'live',
    refreshedAt: typeof result.refreshedAt === 'string' ? result.refreshedAt : ''
  };
}

module.exports = { isAllowedArticleUrl, normalizeNewsResult };
