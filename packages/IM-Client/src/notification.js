const NIO = {
  online: 'online',
  offline: 'offline',
  ban: 'ban',
  onMic: 'on-mic',
  offMic: 'off-mic',
}

export function notification(socket) {
  socket.on('notification', (nio) => {
    const { action } = nio;
    switch (action) {
      case NIO.online:
        break;
      case NIO.offline:
        break;
      case NIO.ban:
        break;
      case NIO.onMic:
        break;
      case NIO.offMic:
        break;
      default:
        console.warn('unknown notification:::: ', nio);
        break;
    }
  });
}
