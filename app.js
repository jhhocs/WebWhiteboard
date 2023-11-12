//https://socket.io/docs/v4/tutorial/step-4

const express = require('express');
const { createServer } = require('http');
//const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);
const router = express.Router();

app.use(express.static(__dirname + '/public/html'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public'));
app.use('/', router);

router.get('/', (req, res) => {
  res.sendFile('/html/index.html');
});

module.exports = router;

io.on('connection', (socket) => {
  console.log("User connected");
  socket.on('draw', (line) => {
    io.emit('draw', line);
  });
  socket.on('clear', () => {
    io.emit('clear');
  });
  socket.on('startStroke', (e) => {
    io.emit('startStroke', e);
 });

 socket.on('endStroke', (e) => {
    io.emit('endStroke', e);
 });

 socket.on('stroke', (e) => {
    io.emit('stroke', e);
 });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});