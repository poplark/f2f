import { User } from "./user";

const NIO = {
  online: 'online',
  offline: 'offline',
  ban: 'ban',
  onMic: 'on-mic',
  offMic: 'off-mic',
}

export function rejoinHandler(newUsers) {
  const { users } = this.room;
  const commonUsers = [];
  const onlineUsers = [];
  const offlineUsers = [];
  let set = new Set(newUsers.map(item => item.userId));
  for (let user of users) {
    if (set.has(user.id)) {
      commonUsers.push(user);
    } else {
      offlineUsers.push(user);
    }
  }
  set = new Set(users.map(item => item.id));
  for (let user of newUsers) {
    if (!set.has(user.userId)) {
      onlineUsers.push(new User(user.userId, user.username));
    }
  }
  this.room.users = commonUsers.concat(onlineUsers);
  for (let user of offlineUsers) {
    this.emit('user-offline', user);
  }
  for (let user of onlineUsers) {
    this.emit('user-online', user);
  }
}

export function onlineHandler(id, username) {
  const user = new User(id, username);
  this.room.addUser(user);
  this.emit('user-online', user);
  return user;
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
      onlineHandler.call(this, payload.userId, payload.username);
      break;
    case NIO.offline:
      this.emit('user-offline', this.room.removeUser(payload.userId));
      break;
    case NIO.ban:
      this.connection.disconnect();
      this.emit('ban', payload.reason);
      break;
    case NIO.onMic:
      break;
    case NIO.offMic:
      break;
    default:
      break;
  }
}
