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

const BG_SRC = '46848685344_76fa3aaf40_b.jpg';

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

const img = new Image();
img.onload = () => {
  // cover-fit the image into the canvas
  const ar = img.width / img.height;
  const car = bg.width / bg.height;
  let dw, dh, dx, dy;
  if (ar > car) {
    dh = bg.height;
    dw = dh * ar;
    dx = (bg.width - dw) / 2;
    dy = 0;
  } else {
    dw = bg.width;
    dh = dw / ar;
    dx = 0;
    dy = (bg.height - dh) / 2;
  }
  bgCtx.fillStyle = '#000';
  bgCtx.fillRect(0, 0, bg.width, bg.height);
  bgCtx.drawImage(img, dx, dy, dw, dh);
};
img.src = BG_SRC;

fg.addEventListener('mousemove', (e) => {
  const rect = fg.getBoundingClientRect();
  const scale = fg.width / rect.width;
  const x = (e.clientX - rect.left) * scale;
  paddle.x = Math.max(0, Math.min(fg.width - paddle.w, x - paddle.w / 2));
});

function frame() {
  stepBall(ball, paddle, bricks, fg.width, fg.height);
  if (bricks.every((b) => !b.alive)) nextLevel();
  fgCtx.clearRect(0, 0, fg.width, fg.height);
  drawBricks(fgCtx, bricks, bg);
  drawPaddle(fgCtx, paddle);
  drawBall(fgCtx, ball);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

credit.textContent =
  'Background: "Bizzarie di Varie Figure" by Giovanni Battista Bracelli, 1624.';
