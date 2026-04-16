const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/doom' });

wss.on('connection', (ws) => {
  console.log('[doom] client connected');
  ws.on('close', () => console.log('[doom] client disconnected'));
});

server.listen(PORT, () => {
  console.log(`breakdoomout dev server on http://localhost:${PORT}`);
});
