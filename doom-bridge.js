// emscripten doom bridge. emscripten module renders to a hidden
// canvas (id="doom-canvas"). this module copies that canvas onto the
// visible bg canvas each frame. keyboard: emscripten SDL listens on
// document by default, so keys reach doom without explicit forwarding.
// preventDefault on game keys stops the page from scrolling.

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
