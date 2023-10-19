const SocketIO = require('socket.io');

module.exports = (server, app) => {
  const io = SocketIO(server, {
    path: '/socket.io',
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    }
  });
  
  app.set('io', io);
  const inData = io.of('/in');
  const outData = io.of('/out');

  inData.on('connection', (socket) => {
    console.log('in 네임스페이스에 접속');
    socket.on('disconnect', () => {
      console.log('in 네임스페이스 접속 해제');
    });
  });

  outData.on('connection', (socket) => {
    console.log('out 네임스페이스에 접속');
    socket.on('disconnect', () => {
      console.log('out 네임스페이스 접속 해제');
    });
  });
};