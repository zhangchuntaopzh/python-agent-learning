const { AVATARS, getAvatar } = require('../../utils/avatars');

Page({
  data: {
    avatars: AVATARS,
    selectedAvatarId: 'cloud'
  },

  onLoad(query) {
    this.setData({ selectedAvatarId: getAvatar(query.avatarId).id });
  },

  selectAvatar(event) {
    this.setData({ selectedAvatarId: getAvatar(event.currentTarget.dataset.id).id });
  },

  goToQuiz() {
    wx.navigateTo({ url: `../quiz/quiz?avatarId=${this.data.selectedAvatarId}` });
  },

  goToNews() {
    wx.navigateTo({ url: '../news/news' });
  }
});
