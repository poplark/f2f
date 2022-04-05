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
      this.socket.on('notification', (data) => {
        console.log('notification::: ', data);
        this.emit('notification', data);
      });
    });
  }

  sendMessage(msg) {
    console.log('sendMessage:::: ', msg.toJSON());
    this.isConnected && this.socket.emit('message', msg);
  }
  sendCommand(cmd) {
    console.log('sendCommand:::: ', cmd.toJSON());
    this.isConnected && this.socket.emit('command', cmd);
  }

  disconnect() {
    this.isConnected && this.socket.disconnect();
  }
}
