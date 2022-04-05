import { Client } from './client';

export function createInstance(userId, username, token) {
  return new Client(userId, username, token);
}
