const { Server } = require('socket.io');
const commandHandler = require('./command');

module.exports = function(server) {
  const io = new Server(server);
  io.on('connection', (socket) => {
    // console.log('connection:::: ', socket);
    commandHandler(io, socket);
    socket.on('disconnect', (data) => {
      // todo - broadcast leave room cmd
      console.log('disconnect:: ', socket, data);
    });
  });
}
