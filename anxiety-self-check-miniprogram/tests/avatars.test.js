const test = require('node:test');
const assert = require('node:assert/strict');

const { AVATARS, getAvatar } = require('../utils/avatars');

test('provides four selectable avatars', () => {
  assert.equal(AVATARS.length, 4);
  assert.equal(AVATARS[0].id, 'cloud');
});

test('uses the default avatar for a missing or invalid id', () => {
  assert.equal(getAvatar().id, 'cloud');
  assert.equal(getAvatar('unknown').id, 'cloud');
});

test('returns an avatar for a valid id', () => {
  assert.equal(getAvatar('moon').label, '月亮与星星');
});
