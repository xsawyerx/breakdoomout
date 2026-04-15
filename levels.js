// picking one or two shape stamps, optionally running a
// row-pattern modifier over the result, and mirroring
// horizontally so the layout looks intentional. Nifty!

import { COLS, ROWS } from './breakout.js';

// stamps write into a cols x rows grid of 0/1. each stamp function
// receives the grid and is responsible for marking cells on.

function stampPyramid(grid) {
  const mid = (COLS - 1) / 2;
  for (let r = 0; r < ROWS; r++) {
    const half = r + 1;
    for (let c = 0; c < COLS; c++) {
      if (Math.abs(c - mid) <= half) grid[r][c] = 1;
    }
  }
}

function stampDiamond(grid) {
  const midC = (COLS - 1) / 2;
  const midR = (ROWS - 1) / 2;
  const radius = Math.min(COLS, ROWS * 1.5) / 2;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const d = Math.abs(c - midC) + Math.abs(r - midR) * 1.5;
      if (d <= radius) grid[r][c] = 1;
    }
  }
}

function stampFortress(grid) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const edge = c < 2 || c >= COLS - 2 || r < 2 || r >= ROWS - 2;
      if (edge) grid[r][c] = 1;
    }
  }
}

function stampBars(grid) {
  for (let r = 0; r < ROWS; r++) {
    if (r % 2 === 0) {
      for (let c = 0; c < COLS; c++) grid[r][c] = 1;
    }
  }
}

function stampCheckerband(grid) {
  const top = 2;
  const bot = Math.min(ROWS, top + 5);
  for (let r = top; r < bot; r++) {
    for (let c = 0; c < COLS; c++) {
      if ((r + c) % 2 === 0) grid[r][c] = 1;
    }
  }
}

function stampX(grid) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const onDiag = Math.abs(c / (COLS - 1) - r / (ROWS - 1)) < 0.12;
      const onAnti = Math.abs(c / (COLS - 1) - (1 - r / (ROWS - 1))) < 0.12;
      if (onDiag || onAnti) grid[r][c] = 1;
    }
  }
}

const STAMPS = [stampPyramid, stampDiamond, stampFortress, stampBars, stampCheckerband, stampX];

// row-pattern modifiers clear some cells back to 0 to add variety.
function modSkipEveryNthRow(grid, n) {
  for (let r = 0; r < ROWS; r++) {
    if (r % n === n - 1) {
      for (let c = 0; c < COLS; c++) grid[r][c] = 0;
    }
  }
}

function modPunchCenterColumn(grid) {
  const midC = Math.floor(COLS / 2);
  for (let r = 0; r < ROWS; r++) grid[r][midC] = 0;
}

const MODIFIERS = [
  (g) => modSkipEveryNthRow(g, 3),
  (g) => modSkipEveryNthRow(g, 4),
  modPunchCenterColumn,
];

function mirrorH(grid) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < Math.floor(COLS / 2); c++) {
      grid[r][COLS - 1 - c] = grid[r][c];
    }
  }
}

function emptyGrid() {
  return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// returns a ROWS x COLS grid of 0/1 indicating which brick slots are alive.
export function generateLevel() {
  const grid = emptyGrid();
  const nStamps = Math.random() < 0.35 ? 2 : 1;
  for (let i = 0; i < nStamps; i++) pick(STAMPS)(grid);
  if (Math.random() < 0.5) pick(MODIFIERS)(grid);
  // guard against trivially empty levels before mirroring so the
  // fallback stamp also gets mirrored and stays symmetric.
  let count = 0;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) count += grid[r][c];
  if (count < 12) pick(STAMPS)(grid);
  mirrorH(grid);
  return grid;
}
