import * as EventEmitter from 'events';
import { io } from 'socket.io-client';

class Connection extends EventEmitter {
  isConnected = false;
  domain = ''
  constructor(domain) {
    super();
    this.domain = domain;
  }
  async connect(room) {
    return new Promise((resolve, reject) => {
      this.socket = io(`${domain}/${room}`);
      this.socket.on('connect', () => {
        this.isConnected = true;
        resolve();
      });
      this.socket.on('connect_error', (err) => {
        console.warn('connection::connect::failed::', err);
        reject(err);
      });
      this.socket.on('disconnect', (reason) => {
        console.warn('connection::disconnect::', reason);
      });
      this.socket.on('data', (data) => {
        console.log('data::: ', data);
        this.emit('message', data);
      });
    });
  }

  sendMessage(msg) {
    this.isConnected && this.socket.emit('message', msg);
  }
  sendCommand(cmd) {
    this.isConnected && this.socket.emit('command', cmd);
  }
  sendRequest(req) {
    this.isConnected && this.socket.emit('request', req);
  }

  disconnect() {
    this.isConnected && this.socket.disconnect();
  }
}

export {
  Connection
}
