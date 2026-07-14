const { QUESTIONS, calculateTotal } = require('../../utils/assessment');
const { getAvatar } = require('../../utils/avatars');

const OPTIONS = ['完全没有', '偶尔', '经常', '几乎每天'];

Page({
  data: {
    questions: QUESTIONS,
    options: OPTIONS,
    currentQuestion: 0,
    selected: null,
    answers: [],
    selectedAvatarId: 'cloud'
  },

  onLoad(query) {
    this.setData({ selectedAvatarId: getAvatar(query.avatarId).id });
  },

  chooseOption(event) {
    this.setData({ selected: Number(event.currentTarget.dataset.value) });
  },

  nextQuestion() {
    if (this.data.selected === null) {
      return;
    }

    const answers = this.data.answers.concat(this.data.selected);
    const isLastQuestion = this.data.currentQuestion === QUESTIONS.length - 1;

    if (isLastQuestion) {
      const score = calculateTotal(answers);
      wx.redirectTo({
        url: `../result/result?score=${score}&avatarId=${this.data.selectedAvatarId}`
      });
      return;
    }

    this.setData({
      answers,
      currentQuestion: this.data.currentQuestion + 1,
      selected: null
    });
  }
});
