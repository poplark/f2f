import * as EventEmitter from 'events';
import { io } from 'socket.io-client';

export class Connection extends EventEmitter {
  isConnected = false;
  async connect() {
    return new Promise((resolve, reject) => {
      this.socket = io({
        transports: ['websocket', 'polling'],
      });
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
      this.socket.on('message', (data) => {
        console.log('message::: ', data);
        this.emit('message', data);
      });
      this.socket.on('command', (data) => {
        console.log('command::: ', data);
        this.emit('command', data);
      });
    });
  }

  sendMessage(msg) {
    this.isConnected && this.socket.emit('message', msg.getMessage());
  }
  sendCommand(cmd) {
    console.log('getMessage:::: ', cmd.getMessage());
    this.isConnected && this.socket.emit('command', cmd.getMessage());
  }

  disconnect() {
    this.isConnected && this.socket.disconnect();
  }
}
