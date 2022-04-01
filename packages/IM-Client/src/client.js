import * as EventEmitter from 'events';
import { Connection } from './connection';
import { User } from './user';

class Client {
  // self
  // room
  // connection
  constructor(username, token) {
    super();
    this.username = username;
    this.token = token;
    this.user = new User(username);
  }
  async join(roomId) {
    this.connection = new Connection('');
    await this.connection.connect(roomId);
    this.connection.sendMessage({ action: 'my'});
    this.connection.sendRequest({ action: 'getUsers'});
    this.connection.sendRequest({ action: 'getMessages', after: Date.now() - 60 * 60 * 1000 });
  }
  async leave() {
    this.connection.disconnect();
    this.connection = null;
  }
}

export {
  Client
}
