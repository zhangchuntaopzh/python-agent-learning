const { parseRss, selectNews } = require('./parser');

async function getHealthNews({ fetchRss, readCache, writeCache, now }) {
  try {
    const items = selectNews(parseRss(await fetchRss()));
    if (items.length === 0) throw new Error('RSS 中没有可展示的资讯');
    const refreshedAt = now().toISOString();
    await writeCache({ items, refreshedAt });
    return { items, source: 'live', refreshedAt };
  } catch (error) {
    try {
      const cache = await readCache();
      const items = selectNews(cache.items || []);
      if (items.length === 0 || typeof cache.refreshedAt !== 'string') throw new Error('没有可用缓存');
      return { items, source: 'cache', refreshedAt: cache.refreshedAt };
    } catch {
      throw new Error('无法加载健康资讯');
    }
  }
}

module.exports = { getHealthNews };
