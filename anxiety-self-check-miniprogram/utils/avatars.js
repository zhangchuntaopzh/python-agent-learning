const AVATARS = [
  { id: 'cloud', label: '微笑云朵', src: '/assets/avatars/anxiety-avatar-cloud.png' },
  { id: 'moon', label: '月亮与星星', src: '/assets/avatars/anxiety-avatar-moon.png' },
  { id: 'sprout', label: '新芽', src: '/assets/avatars/anxiety-avatar-sprout.png' },
  { id: 'lantern', label: '暖光', src: '/assets/avatars/anxiety-avatar-lantern.png' }
];

function getAvatar(id) {
  return AVATARS.find((avatar) => avatar.id === id) || AVATARS[0];
}

module.exports = { AVATARS, getAvatar };
