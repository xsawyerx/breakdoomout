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
  ctx.fillStyle = '#eee';
  ctx.fillRect(p.x, p.y, p.w, p.h);
}

export function drawBall(ctx, b) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.fill();
}

export function drawBricks(ctx, bricks) {
  for (const b of bricks) {
    if (!b.alive) continue;
    ctx.fillStyle = '#888';
    ctx.fillRect(b.x + BRICK_GAP, b.y + BRICK_GAP, b.w - BRICK_GAP * 2, b.h - BRICK_GAP * 2);
  }
}
