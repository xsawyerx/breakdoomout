// ws client for the doom proxy. receives raw 640x400 RGBA framebuffers
// from index.js and paints them onto the provided bg canvas context.
//
// the framebuffer is 0xAARRGGBB little-endian, so on the wire the byte
// order is B, G, R, A. putImageData wants R, G, B, A, so swap B/R per
// pixel before blitting.

const DOOM_W = 640;
const DOOM_H = 400;

export function connectDoom(bgCtx) {
  const img = bgCtx.createImageData(DOOM_W, DOOM_H);
  const url = (location.protocol === 'https:' ? 'wss://' : 'ws://')
    + location.host + '/doom';
  const ws = new WebSocket(url);
  ws.binaryType = 'arraybuffer';

  ws.addEventListener('open', () => console.log('[doom] connected'));
  ws.addEventListener('close', () => console.log('[doom] closed'));
  ws.addEventListener('error', (e) => console.log('[doom] error', e));

  ws.addEventListener('message', (ev) => {
    const src = new Uint8Array(ev.data);
    const dst = img.data;
    // B G R A -> R G B A
    for (let i = 0; i < src.length; i += 4) {
      dst[i]     = src[i + 2];
      dst[i + 1] = src[i + 1];
      dst[i + 2] = src[i];
      dst[i + 3] = 255;
    }
    bgCtx.putImageData(img, 0, 0);
  });

  return ws;
}
