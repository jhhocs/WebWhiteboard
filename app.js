//https://socket.io/docs/v4/tutorial/step-4

const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
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

// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('chat message', (msg) => {
//       console.log('message: ' + msg);
//     });
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });
// });

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});