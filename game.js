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

const BG_SRC = '46848685344_76fa3aaf40_b.jpg';

const { bricks } = makeBricks(fg.width);
const paddle = makePaddle(fg.width, fg.height);
const ball = makeBall(fg.width, fg.height);

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

function frame() {
  stepBall(ball, paddle, bricks, fg.width, fg.height);
  fgCtx.clearRect(0, 0, fg.width, fg.height);
  drawBricks(fgCtx, bricks);
  drawPaddle(fgCtx, paddle);
  drawBall(fgCtx, ball);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

credit.textContent =
  'Background: "Bizzarie di Varie Figure" by Giovanni Battista Bracelli, 1624.';
