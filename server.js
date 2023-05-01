const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});



// serve static files from the "public" directory
app.use(express.static('public'));

// when a new client connects, listen for the "stream" event
io.on('connection', (socket) => {
  socket.on('stream', (dataUrl) => {
    console.log("dataURL coming");
    // broadcast the received stream to all connected clients
    socket.broadcast.emit('stream', dataUrl);
  });
});

// start the server and listen for incoming requests
server.listen(8000, () => {
  console.log('Server started on port 8000');
});