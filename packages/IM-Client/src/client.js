import * as EventEmitter from 'events';
import { Connection } from './connection';
import { User } from './user';
import { Room } from './room';
import { createJoinCommand, createLeaveCommand } from './command';
import { createTextMessage } from './message';

class Client {
  // self
  // user
  // room
  // connection
  constructor(userId, username, token) {
    // super();
    this.token = token;
    this.user = new User(userId, username);
  }
  async join(roomId) {
    this.room = new Room(roomId);
    this.connection = new Connection();

    await this.connection.connect();

    const cmd = createJoinCommand(this.room.id, this.user);
    return await this.connection.sendCommand(cmd);
  }
  async leave() {
    const cmd = createLeaveCommand(this.room.id, this.user);
    await this.connection.sendCommand(cmd);
    this.connection.disconnect();
    this.connection = null;
  }

  async sendMessage(content) {
    const msg = createTextMessage(content, this.user);
    return await this.connection.sendMessage(msg);
  }
}

export {
  Client
}
