const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8000;

const peers = {};

io.on('connection', socket => {
  socket.on('sdp', sdp => {
    console.log('sdp',sdp);
    socket.broadcast.emit('sdp', sdp);
  });

  socket.on('iceCandidate', candidate => {
    socket.broadcast.emit('iceCandidate', candidate);
  });

  socket.on('joinRoom', room => {
    socket.join(room);
    peers[socket.id] = room;

    const otherPeers = Object.keys(peers)
      .filter(id => peers[id] === room && id !== socket.id);

    socket.emit('otherPeers', otherPeers);
    socket.broadcast.to(room).emit('newPeer', socket.id);
  });

  socket.on('disconnect', () => {
    const room = peers[socket.id];

    if (room) {
      delete peers[socket.id];
      io.to(room).emit('peerDisconnected', socket.id);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
