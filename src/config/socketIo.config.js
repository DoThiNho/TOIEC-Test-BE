// socketIo.js
const socketIo = require('socket.io');

let io;

function initializeSocketIo(server) {
  io = socketIo(server, {
    cors: {
      origin: '*'
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    // Add other event handlers here
  });

  return io;
}

function getIo() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

module.exports = { initializeSocketIo, getIo };
