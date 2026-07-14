const test = require('node:test');
const assert = require('node:assert/strict');

const { QUESTIONS, calculateTotal, getResult } = require('../utils/assessment');

test('provides seven questions', () => {
  assert.equal(QUESTIONS.length, 7);
});

test('every assessment question includes a non-diagnostic calming tip', () => {
  assert.equal(QUESTIONS.length, 7);
  for (const question of QUESTIONS) {
    assert.equal(typeof question.tip, 'string');
    assert.ok(question.tip.trim().length > 0);
    assert.doesNotMatch(question.tip, /诊断|处方|治愈/);
  }
});

test('adds seven valid answers', () => {
  assert.equal(calculateTotal([0, 1, 2, 3, 0, 1, 2]), 9);
});

test('rejects incomplete answers', () => {
  assert.throws(() => calculateTotal([0]), /7/);
});

test('rejects answers outside zero through three', () => {
  assert.throws(() => calculateTotal([0, 0, 0, 0, 0, 0, 4]), /0 到 3/);
});

test('maps every score boundary to the intended result', () => {
  assert.equal(getResult(0).level, '当前焦虑感较轻');
  assert.equal(getResult(4).level, '当前焦虑感较轻');
  assert.equal(getResult(5).level, '有一些焦虑感');
  assert.equal(getResult(9).level, '有一些焦虑感');
  assert.equal(getResult(10).level, '焦虑感较明显');
  assert.equal(getResult(14).level, '焦虑感较明显');
  assert.equal(getResult(15).level, '焦虑感较强');
  assert.equal(getResult(21).urgent, true);
});
