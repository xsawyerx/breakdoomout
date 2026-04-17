// draw background on two stacked canvases
const bg = document.getElementById('bg');
const fg = document.getElementById('fg');
const bgCtx = bg.getContext('2d');
const fgCtx = fg.getContext('2d');
const credit = document.getElementById('credit');

import {
  makeBricks, drawBricks,
  makePaddle, drawPaddle,
  makeBall, drawBall, stepBall,
} from './breakout.js';
import { generateLevel } from './levels.js';
import { copyDoomFrame } from './doom-bridge.js';

let bricks = makeBricks(fg.width, generateLevel()).bricks;
const paddle = makePaddle(fg.width, fg.height);
const ball = makeBall(fg.width, fg.height);

function nextLevel() {
  bricks = makeBricks(fg.width, generateLevel()).bricks;
  ball.x = fg.width / 2;
  ball.y = fg.height - 80;
  ball.vx = 3;
  ball.vy = -3;
}

fg.addEventListener('mousemove', (e) => {
  const rect = fg.getBoundingClientRect();
  const scale = fg.width / rect.width;
  const x = (e.clientX - rect.left) * scale;
  paddle.x = Math.max(0, Math.min(fg.width - paddle.w, x - paddle.w / 2));
});

function frame() {
  copyDoomFrame(bgCtx);
  stepBall(ball, paddle, bricks, fg.width, fg.height);
  if (bricks.every((b) => !b.alive)) nextLevel();
  fgCtx.clearRect(0, 0, fg.width, fg.height);
  drawBricks(fgCtx, bricks, bg);
  drawPaddle(fgCtx, paddle);
  drawBall(fgCtx, ball);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

credit.textContent = '';
