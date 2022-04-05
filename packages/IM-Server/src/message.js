const { getSocket } = require('./room');

// const MSG_TYPE = {
//   text: 'text',
//   emoji: 'emoji',
// }

function message(socket, roomId, payload, from, to) {
  const msg = {
    payload,
    from,
    to
  }
  if (to === '@all') {
    socket.broadcast.emit('message', msg);
    return;
  }
  const toSocket = getSocket(roomId, to);
  if (!toSocket) return;
  socket.to(to).emit('message', msg);
}

module.exports = {
  message,
}
