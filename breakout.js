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

export function drawBricks(ctx, bricks) {
  for (const b of bricks) {
    if (!b.alive) continue;
    ctx.fillStyle = '#888';
    ctx.fillRect(b.x + BRICK_GAP, b.y + BRICK_GAP, b.w - BRICK_GAP * 2, b.h - BRICK_GAP * 2);
  }
}
