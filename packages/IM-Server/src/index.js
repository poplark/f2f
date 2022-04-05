const { Server } = require('socket.io');
const commandHandler = require('./command');

module.exports = function(server) {
  const io = new Server(server, {
    transports: ['websocket', 'polling'],
  });
  io.on('connection', (socket) => {
    console.log('connection:::: ', socket.rooms, socket.data);
    commandHandler(io, socket);
  });
}
