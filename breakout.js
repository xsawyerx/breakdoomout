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

// samples average RGB in the brick's region on the background canvas
// and stores it on the brick. called every frame so bricks track the
// live background.
// grabs the full bg frame once and computes the average color of each
// brick's region by indexing into it. much cheaper than calling
// getImageData per brick.
export function sampleBrickColors(bgCtx, bricks, w, h) {
  const frame = bgCtx.getImageData(0, 0, w, h).data;
  const stride = w * 4;
  for (const b of bricks) {
    if (!b.alive) continue;
    const x0 = Math.floor(b.x);
    const y0 = Math.floor(b.y);
    const x1 = Math.min(w, Math.floor(b.x + b.w));
    const y1 = Math.min(h, Math.floor(b.y + b.h));
    let r = 0, g = 0, bl = 0, n = 0;
    // step 4 pixels in x, 4 in y
    for (let y = y0; y < y1; y += 4) {
      let i = y * stride + x0 * 4;
      for (let x = x0; x < x1; x += 4) {
        r += frame[i];
        g += frame[i + 1];
        bl += frame[i + 2];
        n++;
        i += 16;
      }
    }
    if (n > 0) b.color = [Math.round(r / n), Math.round(g / n), Math.round(bl / n)];
  }
}

export function drawBricks(ctx, bricks) {
  for (const b of bricks) {
    if (!b.alive) continue;
    const [r, g, bl] = b.color || [136, 136, 136];
    const x = b.x + BRICK_GAP;
    const y = b.y + BRICK_GAP;
    const w = b.w - BRICK_GAP * 2;
    const h = b.h - BRICK_GAP * 2;
    ctx.fillStyle = `rgb(${r},${g},${bl})`;
    ctx.fillRect(x, y, w, h);
    // bevel: light top-left, dark bottom-right
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(x, y, w, 2);
    ctx.fillRect(x, y, 2, h);
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(x, y + h - 2, w, 2);
    ctx.fillRect(x + w - 2, y, 2, h);
  }
}
