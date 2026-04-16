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

  proc.stderr.on('data', (d) => console.log('[doom:err]', d.toString().trimEnd()));
  proc.on('exit', (code) => {
    console.log('[doom] exited', code);
    try { ws.close(); } catch {}
  });

  ws.on('close', () => {
    console.log('[doom] client disconnected, killing doom');
    try { proc.stdin.write('Q\n'); } catch {}
    try { proc.kill('SIGTERM'); } catch {}
  });
});

server.listen(PORT, () => {
  console.log(`breakdoomout dev server on http://localhost:${PORT}`);
});
