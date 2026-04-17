// emscripten doom bridge. renders to a hidden canvas
// (id="doom-canvas"). module exposes a function to copy
// that hidden canvas onto the visible bg canvas each frame.

const doomCanvas = document.getElementById('doom-canvas');

export function copyDoomFrame(bgCtx) {
  bgCtx.drawImage(doomCanvas, 0, 0);
}
