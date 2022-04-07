import { User } from "./user";

const NIO = {
  online: 'online',
  offline: 'offline',
  ban: 'ban',
  onMic: 'on-mic',
  offMic: 'off-mic',
}

/**
 * 通知消息的处理
 * @param {*} nio 
 */
export function notificationHandler(nio) {
  console.log('notificationHandler::: ', nio)
  /**
   * nio: {
   *  action,
   *  payload,
   *  from,
   *  to,
   * }
   */
  const { action, payload } = nio;
  switch (action) {
    case NIO.online:
      const onlineUser = new User(payload.userId, payload.username);
      this.room.addUser(onlineUser);
      this.emit('user-online', onlineUser);
      break;
    case NIO.offline:
      const offlineUser = this.room.removeUser(payload.userId);
      this.emit('user-offline', offlineUser);
      break;
    case NIO.ban:
      this.connection.disconnect();
      this.emit('ban');
      break;
    case NIO.onMic:
      break;
    case NIO.offMic:
      break;
    default:
      break;
  }
}
