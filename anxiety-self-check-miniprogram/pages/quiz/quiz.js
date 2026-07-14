const { QUESTIONS, calculateTotal } = require('../../utils/assessment');

const OPTIONS = ['完全没有', '偶尔', '经常', '几乎每天'];

Page({
  data: {
    questions: QUESTIONS,
    options: OPTIONS,
    currentQuestion: 0,
    selected: null,
    answers: []
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
      wx.redirectTo({ url: `../result/result?score=${score}` });
      return;
    }

    this.setData({
      answers,
      currentQuestion: this.data.currentQuestion + 1,
      selected: null
    });
  }
});
