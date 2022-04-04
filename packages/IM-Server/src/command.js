const { getUsers, joinRoom, leaveRoom } = require('./room');
const { userOnline, userOffline } = require('./notification');

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
  joinRoom(socket, roomId, userId);
  socket.join(roomId);
  const users = getUsers(roomId, userId);
  socket.emit(action, {
    users,
  });
  userOnline(socket, roomId, userId);
}

function leave(io, socket, cmd) {
  const { payload } = cmd;
  const { roomId, userId } = payload;
  leaveRoom(socket, roomId, userId);
  userOffline(socket, roomId, userId);
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
}
