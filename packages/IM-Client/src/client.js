import * as EventEmitter from 'events';
import { Connection } from './connection';
import { User } from './user';
import { Room } from './room';
import {
  createJoinCommand,
  createLeaveCommand,
  createKickOutCommand,
} from './command';
import { createTextMessage } from './message';

class Client {
  // token
  // user
  // connection
  // room
  // todo - token
  constructor(userId, username, token) {
    // super();
    this.token = token;
    this.user = new User(userId, username);
    this.connection = new Connection();
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
    return await this.connection.sendCommand(cmd);
  }

  /**
   * 离开房间
   */
  async leave() {
    const cmd = createLeaveCommand(this.room.id, this.user);
    await this.connection.sendCommand(cmd);
    this.connection.disconnect();
    this.connection = null;
  }

  /**
   * 发送消息 - 暂仅支持文本消息
   * @param {*} content 
   * @returns 
   */
  async sendMessage(content) {
    const msg = createTextMessage(content, this.user);
    return await this.connection.sendMessage(msg);
  }

  /**
   * 将他人踢下线
   * @param {*} user 
   * @returns 
   */
  async kickOut(user) {
    const cmd = createKickOutCommand(this.room.id, this.user, user);
    return await this.connection.sendCommand(cmd);
  }
}

export {
  Client
}
