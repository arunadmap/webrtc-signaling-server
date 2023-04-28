const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
     
    }
  });
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('create-something', (msg) => {
        io.emit('foo', msg);
      console.log('message: ' + msg);
    });
  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});