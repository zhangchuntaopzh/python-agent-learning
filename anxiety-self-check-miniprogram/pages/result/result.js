const { getResult } = require('../../utils/assessment');
const { getAvatar } = require('../../utils/avatars');

Page({
  data: {
    score: 0,
    result: getResult(0),
    avatar: getAvatar()
  },

  onLoad(query) {
    const score = Number(query.score);
    this.setData({
      score,
      result: getResult(score),
      avatar: getAvatar(query.avatarId)
    });
  },

  restart() {
    wx.reLaunch({ url: `../index/index?avatarId=${this.data.avatar.id}` });
  }
});
