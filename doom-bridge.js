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

export function setupKeyForwarding(fgCanvas) {
  for (const type of ['keydown', 'keyup']) {
    document.addEventListener(type, (e) => {
      const clone = new KeyboardEvent(type, {
        key: e.key,
        code: e.code,
        keyCode: e.keyCode,
        which: e.which,
        bubbles: true,
        cancelable: true,
      });
      doomCanvas.dispatchEvent(clone);
    });
  }
}
