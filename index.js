const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DOOM_BIN = path.join(__dirname, 'doomgeneric', 'doomgeneric', 'doomgeneric_server');
const WAD = path.join(__dirname, 'doom1.wad');
const DOOM_W = 640;
const DOOM_H = 400;
const FRAME_SIZE = DOOM_W * DOOM_H * 4;

app.use(express.static(__dirname));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/doom' });

function spawnDoom() {
  return spawn(DOOM_BIN, ['-iwad', WAD, '-warp', '1', '1', '-skill', '3'], {
    stdio: ['pipe', 'inherit', 'pipe', 'pipe'],
    cwd: __dirname,
  });
}

wss.on('connection', (ws) => {
  console.log('[doom] client connected, spawning doom');
  const proc = spawnDoom();
  const frameStream = proc.stdio[3];

  // accumulate partial reads until a full FRAME_SIZE chunk is available.
  let buf = Buffer.alloc(FRAME_SIZE * 2);
  let bufLen = 0;
  const pending = [];

  frameStream.on('data', (chunk) => {
    if (bufLen + chunk.length > buf.length) {
      const nb = Buffer.alloc(buf.length + chunk.length + FRAME_SIZE);
      buf.copy(nb, 0, 0, bufLen);
      buf = nb;
    }
    chunk.copy(buf, bufLen);
    bufLen += chunk.length;
    while (bufLen >= FRAME_SIZE && pending.length) {
      const frame = Buffer.from(buf.subarray(0, FRAME_SIZE));
      buf.copyWithin(0, FRAME_SIZE, bufLen);
      bufLen -= FRAME_SIZE;
      pending.shift().resolve(frame);
    }
  });

  function requestFrame() {
    return new Promise((resolve, reject) => {
      pending.push({ resolve, reject });
      try { proc.stdin.write('F\n'); } catch (e) { reject(e); }
    });
  }

  proc.stderr.on('data', (d) => console.log('[doom:err]', d.toString().trimEnd()));
  proc.on('exit', (code) => {
    console.log('[doom] exited', code);
    for (const p of pending) p.reject(new Error('doom exited'));
    try { ws.close(); } catch {}
  });

  ws.on('close', () => {
    console.log('[doom] client disconnected, killing doom');
    try { proc.stdin.write('Q\n'); } catch {}
    try { proc.kill('SIGTERM'); } catch {}
  });

  const FPS = 30;
  const FRAME_MS = Math.round(1000 / FPS);
  let alive = true;
  ws.on('close', () => { alive = false; });

  (async () => {
    while (alive) {
      try {
        proc.stdin.write('T 1\n');
        const fb = await requestFrame();
        if (!alive) break;
        ws.send(fb, { binary: true });
      } catch (e) {
        console.log('[doom] loop error:', e.message);
        break;
      }
      await new Promise((r) => setTimeout(r, FRAME_MS));
    }
  })();
});

server.listen(PORT, () => {
  console.log(`breakdoomout dev server on http://localhost:${PORT}`);
});
