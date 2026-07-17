const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('registers the five application pages', () => {
  const app = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8'));
  assert.deepEqual(app.pages, [
    'pages/index/index',
    'pages/quiz/quiz',
    'pages/result/result',
    'pages/news/news',
    'pages/article/article'
  ]);
});

test('uses a registered-looking mini-program AppID for preview', () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'project.config.json'), 'utf8'));
  assert.match(config.appid, /^wx[a-z0-9]{16}$/);
  assert.notEqual(config.appid, 'touristappid');
});

test('welcomes users with a start action', () => {
  const page = fs.readFileSync(path.join(root, 'pages/index/index.wxml'), 'utf8');
  assert.match(page, /开始自评/);
});

test('quiz provides a next action and result page lets users restart', () => {
  const quiz = fs.readFileSync(path.join(root, 'pages/quiz/quiz.wxml'), 'utf8');
  const result = fs.readFileSync(path.join(root, 'pages/result/result.wxml'), 'utf8');

  assert.match(quiz, /下一题|查看结果/);
  assert.match(result, /重新测评/);
});

test('result page makes the assessment limitation clear', () => {
  const result = fs.readFileSync(path.join(root, 'pages/result/result.wxml'), 'utf8');
  assert.match(result, /不能替代医疗诊断/);
});

test('home page provides selectable avatars and passes the selection onward', () => {
  const index = fs.readFileSync(path.join(root, 'pages/index/index.wxml'), 'utf8');
  const quiz = fs.readFileSync(path.join(root, 'pages/quiz/quiz.js'), 'utf8');

  assert.match(index, /选择一个陪伴头像/);
  assert.match(index, /bindtap="selectAvatar"/);
  assert.match(quiz, /avatarId/);
});

test('home avatar grid stays two columns with proportionate images', () => {
  const style = fs.readFileSync(path.join(root, 'pages/index/index.wxss'), 'utf8');
  assert.match(style, /\.avatar-grid\s*\{[\s\S]*justify-content:\s*space-between/);
  assert.match(style, /\.avatar-option\s*\{[\s\S]*width:\s*48%/);
  assert.match(style, /\.avatar-image\s*\{[\s\S]*width:\s*70%/);
  assert.match(style, /\.avatar-image\s*\{[\s\S]*max-width:\s*112rpx/);
});

test('result page renders the selected avatar and preserves it on restart', () => {
  const script = fs.readFileSync(path.join(root, 'pages/result/result.js'), 'utf8');
  const page = fs.readFileSync(path.join(root, 'pages/result/result.wxml'), 'utf8');

  assert.match(script, /getAvatar/);
  assert.match(script, /avatarId/);
  assert.match(page, /{{avatar.src}}/);
});

test('home links to a news page that calls the healthNews cloud function', () => {
  const indexScript = fs.readFileSync(path.join(root, 'pages/index/index.js'), 'utf8');
  const index = fs.readFileSync(path.join(root, 'pages/index/index.wxml'), 'utf8');
  const newsScript = fs.readFileSync(path.join(root, 'pages/news/news.js'), 'utf8');
  const news = fs.readFileSync(path.join(root, 'pages/news/news.wxml'), 'utf8');
  assert.match(indexScript, /goToNews/);
  assert.match(index, /查看心理健康资讯/);
  assert.match(newsScript, /callFunction[\s\S]*healthNews/);
  assert.match(news, /来源：中国新闻网健康 RSS/);
  assert.match(news, /点击查看原文/);
});

test('article page loads the supplied original link in a web view', () => {
  const script = fs.readFileSync(path.join(root, 'pages/article/article.js'), 'utf8');
  const page = fs.readFileSync(path.join(root, 'pages/article/article.wxml'), 'utf8');
  assert.match(script, /decodeURIComponent/);
  assert.match(script, /isAllowedArticleUrl/);
  assert.match(script, /originalUnavailable/);
  assert.match(page, /原文暂不可用/);
  assert.match(page, /业务域名授权/);
  assert.match(page, /小程序.*项目主体/);
  assert.match(page, /阅读者.*无法自行授权/);
  assert.match(page, /wx:else/);
  assert.match(page, /<web-view src="{{url}}"/);
});

test('quiz renders the non-diagnostic question tip below its prompt', () => {
  const quiz = fs.readFileSync(path.join(root, 'pages/quiz/quiz.wxml'), 'utf8');
  assert.match(quiz, /question-tip/);
  assert.match(quiz, /questions\[currentQuestion\]\.tip/);
});

test('README documents CloudBase deployment and the RSS metadata boundary', () => {
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  assert.match(readme, /自评.*无后端|自评.*不需要云服务/);
  assert.match(readme, /资讯.*需要.*CloudBase|CloudBase.*资讯/);
  assert.match(readme, /https:\/\/www\.chinanews\.com\.cn\/rss\/jk\.xml/);
  assert.match(readme, /healthNews/);
  assert.match(readme, /自己的 CloudBase 环境/);
  assert.match(readme, /环境 ID.*不写入代码/);
  assert.match(readme, /npm install/);
  assert.match(readme, /上传并部署：云端安装依赖/);
  assert.match(readme, /health_news_cache/);
  assert.match(readme, /health_news_cache.*只含公开资讯元数据和刷新时间/);
  assert.match(readme, /health_news_cache.*不含正文、图片或摘要/);
  assert.match(readme, /只读取.*标题.*发布日期.*原文链接/);
  assert.match(readme, /不展示或存储正文、图片、摘要/);
  assert.match(readme, /不会基于资讯给出医疗结论/);
  assert.match(readme, /最多显示 10 条标题/);
  assert.match(readme, /原始链接/);
  assert.match(readme, /上一次成功缓存/);
  assert.match(readme, /若没有缓存/);
  assert.match(readme, /重新加载/);
  assert.match(readme, /原文暂不可用/);
  assert.match(readme, /业务域名授权/);
  assert.match(readme, /小程序.*项目主体/);
  assert.match(readme, /阅读者.*无法自行授权/);
  assert.match(readme, /当前.*不会尝试.*打开.*原文/);
});
