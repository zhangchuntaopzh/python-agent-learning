const QUESTIONS = [
  { id: 1, text: '感到紧张、焦虑或心烦' },
  { id: 2, text: '无法停止或控制担忧' },
  { id: 3, text: '对很多不同的事情担忧过多' },
  { id: 4, text: '很难放松下来' },
  { id: 5, text: '坐立不安，难以静坐' },
  { id: 6, text: '容易变得烦躁或易怒' },
  { id: 7, text: '感到好像有什么可怕的事会发生' }
];

function calculateTotal(answers) {
  if (!Array.isArray(answers) || answers.length !== QUESTIONS.length) {
    throw new Error('需要完成 7 道题');
  }
  if (answers.some((answer) => !Number.isInteger(answer) || answer < 0 || answer > 3)) {
    throw new Error('答案必须在 0 到 3 之间');
  }
  return answers.reduce((total, answer) => total + answer, 0);
}

function getResult(score) {
  if (!Number.isInteger(score) || score < 0 || score > 21) {
    throw new Error('分数必须在 0 到 21 之间');
  }
  if (score <= 4) {
    return { level: '当前焦虑感较轻', message: '可继续留意睡眠、饮食与休息节奏。', urgent: false };
  }
  if (score <= 9) {
    return { level: '有一些焦虑感', message: '可以尝试规律作息、呼吸放松或与信任的人聊聊。', urgent: false };
  }
  if (score <= 14) {
    return { level: '焦虑感较明显', message: '若这种状态持续或影响生活，考虑向心理健康专业人士咨询。', urgent: false };
  }
  return {
    level: '焦虑感较强',
    message: '建议尽快联系心理健康专业人士；如感到无法保证自身安全，请联系当地紧急服务或危机支持。',
    urgent: true
  };
}

module.exports = { QUESTIONS, calculateTotal, getResult };
