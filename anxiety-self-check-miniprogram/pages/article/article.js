const { isAllowedArticleUrl } = require('../../utils/news');

Page({
  data: { url: '', originalUnavailable: true },

  onLoad(query) {
    const url = query && query.url ? decodeURIComponent(query.url) : '';
    if (!isAllowedArticleUrl(url)) {
      wx.navigateBack();
      return;
    }
    this.setData({ url });
  }
});
