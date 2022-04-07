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
        console.log('connect::: ');
        if (this.isConnected) {
          this.emit('reconnected');
        } else {
          this.isConnected = true;
          resolve();
        }
      });
      this.socket.on('connect_error', (err) => {
        console.warn('connection::connect::failed::', err);
        reject(err);
      });
      this.socket.on('disconnect', (reason) => {
        if (this.isConnected) {
          this.emit('reconnecting');
        } else {
          console.warn('connection::disconnect::', reason);
        }
        this.clearSendReceives();
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
      this.socket.on('message', (msg) => {
        /**
         * {
         *  content: "hello f2f",
         *  timestamp: 1649233837821,
         *  type: "text",
         *  userId: 10,
         *  username: "一棵小白杨"
         * }
         */
        const { payload } = msg;
        this.emit('message', payload);
      });
      this.socket.on('notification', (nio) => {
        console.log('notification::: ', nio);
        this.emit('notification', nio);
      });
    });
  }

  /**
   * 发送命令
   * @param {*} cmd 
   * @returns 
   */
  // todo - log, validate
  // @log
  // @validate
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
   * private - 清空发送的
   */
  clearSendReceives() {
    for (let [_, item] of this.sendReceives) {
      const [_1, _2, reject] = item;
      reject(new Error('Connection is disconnected'));
    }
    this.sendReceives.clear();
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.isConnected) {
      this.isConnected = false;
      this.socket.disconnect();
    }
    this.socket = null;
  }
}
