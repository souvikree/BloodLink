const socketIO = require('socket.io');

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: { origin: "*" }
  });

  io.on('connection', (socket) => {
    console.log('User connected to socket:', socket.id);

    socket.on('register', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their personal room`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};

module.exports = setupSocket;
