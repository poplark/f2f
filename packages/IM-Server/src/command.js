const CMD = {
  join: 'join',
  leave: 'leave',
  kickOut: 'kick-out',
  askMic: 'ask-mic',
  onMic: 'on-mic',
  offMic: 'off-mic',
}

function join(io, socket, cmd) {
  const { action, payload } = cmd;
  const { roomId } = payload;
  socket.join(roomId);
  io.to(roomId).emit('command', {
    action,
    payload,
  });
}

function leave(io, socket, cmd) {
  const { action, payload } = cmd;
  const { roomId } = payload;
  socket.leave(roomId);
  io.to(roomId).emit('command', {
    action,
    payload,
  });
}

module.exports = function(io, socket) {
  socket.on('command', (cmd) => {
    console.log('command:::: ', cmd);
    switch (cmd.action) {
      case CMD.join:
        join(io, socket, cmd);
        break;
      case CMD.leave:
        leave(io, socket, cmd);
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
