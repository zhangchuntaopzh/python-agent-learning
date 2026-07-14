const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('registers the three application pages', () => {
  const app = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8'));
  assert.deepEqual(app.pages, [
    'pages/index/index',
    'pages/quiz/quiz',
    'pages/result/result'
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
