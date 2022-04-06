import * as EventEmitter from 'events';
import { io } from 'socket.io-client';

const MAX_WAIT_TIME = 10 * 1000;

export class Connection extends EventEmitter {
  isConnected = false;
  socket = null;
  sendReceives  = new Map();

  /**
   * 建立连接
   * @returns 
   */
  connect() {
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
      this.socket.on('command', (res) => {
        // todo - res status code
        const { sequence, payload } = res;
        if (this.sendReceives.has(sequence)) {
          const [ _, resolve, reject ] = this.sendReceives.get(sequence);
          this.sendReceives.delete(sequence);
          resolve(payload);
        } else {
          // todo
          console.warn(`Receive unknown command response`);
        }
      });
      this.socket.on('message', (data) => {
        console.log('message::: ', data);
        this.emit('message', data);
      });
      this.socket.on('notification', (data) => {
        console.log('notification::: ', data);
        this.emit('notification', data);
      });
    });
  }

  /**
   * 发送命令
   * @param {*} cmd 
   * @returns 
   */
  sendCommand(cmd) {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        let timer = 0;
        const _resolve = (...args) => {
          timer && window.clearTimeout(timer);
          this.sendReceives.delete(cmd.sequence);
          resolve(...args);
        }
        const _reject = (...args) => {
          timer && window.clearTimeout(timer);
          this.sendReceives.delete(cmd.sequence);
          reject(...args);
        }
        this.sendReceives.set(cmd.sequence, [cmd, _resolve, _reject]);
        this.socket.emit('command', cmd)
        window.setTimeout(() => {
          // todo - 增加超时重试？？？
          this.sendReceives.delete(cmd.sequence);
          reject(new Error(`Exceeding the maximum waiting time`))
        }, MAX_WAIT_TIME);
      } else {
        reject(new Error(`Connection is not open`));
      }
    });
  }

  /**
   * 发送消息
   * @param {*} msg 
   * @returns 
   */
  sendMessage(msg) {
    return this.sendCommand(msg);
  }

  /**
   * 断开连接
   */
  disconnect() {
    this.isConnected && this.socket.disconnect();
    this.isConnected = false;
    this.socket = null;
    for (let [_, item] of this.sendReceives) {
      const [_1, _2, reject] = item;
      reject(new Error('Connection is disconnected'));
    }
    this.sendReceives.clear();
  }
}
