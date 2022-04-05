const Room = require('./room');
const Notification = require('./notification');

const CMD = {
  join: 'join',
  leave: 'leave',
  kickOut: 'kick-out',
  askMic: 'ask-mic',
  onMic: 'on-mic',
  offMic: 'off-mic',
}

function join(socket, cmd) {
  const { action, payload } = cmd;
  const { roomId, userId } = payload;
  socket.join(roomId);
  socket.data.roomId = roomId;
  socket.data.userId = userId;

  Room.join(socket, roomId, userId);
  Notification.join(socket, roomId, userId);

  const users = Room.getUsers(roomId, userId);
  socket.emit('command', {
    action,
    payload: { users },
  });
}

function leave(socket, cmd) {
  const { action } = cmd;

  const { roomId, userId } = socket.data;
  Room.leave(socket, roomId, userId);
  Notification.leave(socket, roomId, userId);

  socket.emit('command', {
    action,
    payload: {},
  });

  // todo - 自行断开么？？
  socket.disconnect();
}

function disconnect(io, socket) {
  for (let room of socket.rooms) {
    console.log('room::: ', room);
    io.to(room).emit()
    leaveRoom(socket, room, socket.data.userId)
  }
}

module.exports = function(io, socket) {
  socket.on('command', (cmd) => {
    console.log('command:::: ', cmd);
    switch (cmd.action) {
      case CMD.join:
        join(socket, cmd);
        break;
      case CMD.leave:
        leave(socket, cmd);
        break;
      case CMD.kickOut:
        break;
      case CMD.askMic:
        break;
      case CMD.onMic:
        break;
      case CMD.offMic:
        break;
      default:
        console.warn('unknown command:::: ', cmd);
        break;
    }
  });
  socket.on('disconnect', () => {

  })
}
