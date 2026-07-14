const { normalizeNewsResult } = require('../../utils/news');

Page({
  data: { items: [], loading: true, error: '', source: 'live', refreshedAt: '' },

  onLoad() {
    this.loadNews();
  },

  onPullDownRefresh() {
    this.loadNews(true);
  },

  async loadNews(fromPullDown) {
    this.setData({ loading: true, error: '' });
    try {
      const response = await wx.cloud.callFunction({ name: 'healthNews' });
      this.setData({ loading: false, ...normalizeNewsResult(response.result) });
    } catch (error) {
      this.setData({ loading: false, items: [], error: '暂时无法加载资讯，请稍后重试。' });
    } finally {
      if (fromPullDown) wx.stopPullDownRefresh();
    }
  },

  retry() {
    this.loadNews(false);
  },

  openArticle(event) {
    const url = event.currentTarget.dataset.url;
    wx.navigateTo({ url: `../article/article?url=${encodeURIComponent(url)}` });
  }
});
