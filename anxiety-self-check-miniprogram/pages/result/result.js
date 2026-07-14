const { getResult } = require('../../utils/assessment');

Page({
  data: {
    score: 0,
    result: getResult(0)
  },

  onLoad(query) {
    const score = Number(query.score);
    this.setData({ score, result: getResult(score) });
  },

  restart() {
    wx.reLaunch({ url: '../index/index' });
  }
});
