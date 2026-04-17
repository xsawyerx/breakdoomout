// emscripten doom bridge. renders to a hidden canvas
// (id="doom-canvas"). module exposes a function to copy
// that hidden canvas onto the visible bg canvas each frame.
//
// keyboard events are forwarded from the visible fg canvas to the
// hidden doom canvas so SDL picks them up.

const doomCanvas = document.getElementById('doom-canvas');

export function copyDoomFrame(bgCtx) {
  bgCtx.drawImage(doomCanvas, 0, 0);
}

const GAME_KEYS = new Set([
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'w', 'a', 's', 'd', 'f', 'e',
  ' ', 'Enter', 'Escape', 'Tab', 'Shift',
]);

export function setupKeyForwarding() {
  for (const type of ['keydown', 'keyup']) {
    document.addEventListener(type, (e) => {
      if (GAME_KEYS.has(e.key)) e.preventDefault();
    });
  }
}
