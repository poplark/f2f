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

function response(socket, cmd, payload) {
  const { action, sequence } = cmd;
  socket.emit('command', {
    action,
    sequence,
    payload,
  });
}

function join(socket, cmd) {
  const { payload } = cmd;
  const { roomId, userId, username } = payload;
  socket.join(roomId);
  socket.data.roomId = roomId;
  socket.data.userId = userId;
  socket.data.username = username;

  Room.join(socket, roomId, userId);
  Notification.join(socket, roomId, userId);

  response(socket, cmd, {
    users: Room.getUsers(roomId, userId).filter(item => (item.userId !== userId))
  });
}

function leave(socket, cmd) {
  const { roomId, userId } = socket.data;
  Room.leave(socket, roomId, userId);
  Notification.leave(socket, roomId, userId);

  response(socket, cmd, {});

  // todo - 自行断开么？？
  // socket.disconnect();
}

function disconnect(io, socket, reason) {
  const { roomId, userId } = socket.data;

  Room.leave(socket, roomId, userId);
  Notification.disconnect(io, roomId, userId, reason);
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
  socket.on('disconnect', (reason) => {
    disconnect(io, socket, reason);
  });
}
