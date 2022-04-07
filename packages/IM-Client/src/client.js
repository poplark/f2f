import * as EventEmitter from 'events';
import { Connection } from './connection';
import { User } from './user';
import { Room } from './room';
import { Message } from './message';
import {
  createJoinCommand,
  createLeaveCommand,
  createKickOutCommand,
  createTextMessage,
} from './command';
import { notificationHandler } from './notification';

class Client extends EventEmitter {
  // token
  // user
  // connection
  // room
  // todo - token
  constructor(userId, username, token) {
    super();
    this.token = token;
    this.user = new User(userId, username);
    this.connection = new Connection();
    this.connection.on('reconnecting', () => {
      console.log('connection::reconnecting::: ');
    });
    this.connection.on('reconnected', () => {
      console.log('connection::reconnected::: ');
      // todo - rejoin
    });
    this.connection.on('message', (payload) => {
      console.log('connection::message::: ', payload);
        const message = new Message(payload);
        this.room.pushMessage(message);
    });
    this.connection.on('notification', notificationHandler.bind(this));
  }

  /**
   * 加入房间
   * @param {*} roomId 
   * @returns 
   */
  async join(roomId) {
    this.room = new Room(roomId);
    await this.connection.connect();
    const cmd = createJoinCommand(this.room.id, this.user);
    const payload = await this.connection.sendCommand(cmd);
    const { users } = payload;
    const res = [];
    users.forEach((item) => {
      const onlineUser = new User(item.userId, item.username);
      res.push(onlineUser);
      this.room.addUser(onlineUser);
      this.emit('user-online', onlineUser);
    });
    return res;
  }

  /**
   * 离开房间
   */
  async leave() {
    const cmd = createLeaveCommand(this.user);
    await this.connection.sendCommand(cmd);
    this.connection.disconnect();
    this.connection = null;
    this.room = null;
  }

  /**
   * 发送消息 - 暂仅支持文本消息
   * @param {*} content 
   * @returns 
   */
  async sendMessage(content) {
    const msg = createTextMessage(content, this.user);
    const payload = await this.connection.sendMessage(msg);
    const message = new Message(payload);
    this.room.pushMessage(message);
    return message;
  }

  /**
   * 将他人踢下线
   * @param {*} user 
   * @returns 
   */
  async kickOut(user) {
    const cmd = createKickOutCommand(user, this.user);
    return await this.connection.sendCommand(cmd);
  }
}

export {
  Client
}
