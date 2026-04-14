// breakout overlay: bricks, paddle, ball.

export const COLS = 16;
export const ROWS = 10;
export const BRICK_GAP = 2;
export const BRICK_TOP = 40;

export function makeBricks(canvasW) {
  const bw = canvasW / COLS;
  const bh = 28;
  const bricks = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      bricks.push({
        c, r,
        x: c * bw,
        y: BRICK_TOP + r * bh,
        w: bw,
        h: bh,
        alive: true,
      });
    }
  }
  return { bricks, bw, bh };
}

export function makePaddle(canvasW, canvasH) {
  return {
    w: 100,
    h: 12,
    x: canvasW / 2 - 50,
    y: canvasH - 40,
  };
}

export function makeBall(canvasW, canvasH) {
  return {
    x: canvasW / 2,
    y: canvasH - 80,
    r: 6,
    vx: 3,
    vy: -3,
  };
}

export function stepBall(ball, paddle, bricks, w, h) {
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx = -ball.vx; }
  if (ball.x + ball.r > w) { ball.x = w - ball.r; ball.vx = -ball.vx; }
  if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy = -ball.vy; }
  if (ball.y - ball.r > h) {
    ball.x = w / 2;
    ball.y = h - 80;
    ball.vx = 3;
    ball.vy = -3;
  }

  if (
    ball.x > paddle.x && ball.x < paddle.x + paddle.w &&
    ball.y + ball.r > paddle.y && ball.y + ball.r < paddle.y + paddle.h + 6 &&
    ball.vy > 0
  ) {
    ball.vy = -ball.vy;
    const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
    ball.vx = hit * 5;
  }

  for (const b of bricks) {
    if (!b.alive) continue;
    if (
      ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w &&
      ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h
    ) {
      b.alive = false;
      const prevX = ball.x - ball.vx;
      const prevY = ball.y - ball.vy;
      const fromSide = prevX < b.x || prevX > b.x + b.w;
      if (fromSide) ball.vx = -ball.vx; else ball.vy = -ball.vy;
      break;
    }
  }
}

export function drawPaddle(ctx, p) {
  const r = p.h / 2;
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.roundRect(p.x + 1, p.y + 2, p.w, p.h, r);
  ctx.fill();
  ctx.fillStyle = '#f2f2f2';
  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.w, p.h, r);
  ctx.fill();
}

export function drawBall(ctx, b) {
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.arc(b.x + 1, b.y + 2, b.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.fill();
}

// draws each live brick as a window onto the corresponding region of
// the bg canvas, so the brick actually shows what is behind it. the
// bevel and gap between bricks are what make the grid still read as
// bricks rather than a plain copy of the bg.
export function drawBricks(ctx, bricks, bgCanvas) {
  for (const b of bricks) {
    if (!b.alive) continue;
    const x = b.x + BRICK_GAP;
    const y = b.y + BRICK_GAP;
    const w = b.w - BRICK_GAP * 2;
    const h = b.h - BRICK_GAP * 2;
    ctx.drawImage(bgCanvas, x, y, w, h, x, y, w, h);
    // bevel: light top-left, dark bottom-right. thicker than a pixel
    // outline so the grid still reads as discrete bricks even when the
    // bg content varies a lot within a single cell.
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fillRect(x, y, w, 3);
    ctx.fillRect(x, y, 3, h);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(x, y + h - 3, w, 3);
    ctx.fillRect(x + w - 3, y, 3, h);
  }
}
