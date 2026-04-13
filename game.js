const bg = document.getElementById('bg');
const fg = document.getElementById('fg');
const bgCtx = bg.getContext('2d');
const fgCtx = fg.getContext('2d');

bgCtx.fillStyle = '#222';
bgCtx.fillRect(0, 0, bg.width, bg.height);

fgCtx.fillStyle = 'rgba(255,255,255,0.04)';
fgCtx.fillRect(0, 0, fg.width, fg.height);
