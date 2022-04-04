import * as EventEmitter from 'events';
import { Connection } from './connection';
import { User } from './user';
import { createJoinCommand, createLeaveCommand } from './command';

class Client {
  // self
  // room
  // connection
  constructor(username, token) {
    // super();
    this.username = username;
    this.token = token;
    this.user = new User(username);
  }
  async join(roomId) {
    this.connection = new Connection();
    await this.connection.connect();

    const cmd = createJoinCommand(roomId, this.user);
    this.connection.sendCommand(cmd);
  }
  async leave() {
    this.connection.sendCommand({ action: 'leave', payload: {
      username: this.username,
    }});
    this.connection.disconnect();
    this.connection = null;
  }
}

export {
  Client
}
