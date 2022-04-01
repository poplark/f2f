import { Client } from './client';

export function createInstance(username, token) {
  return new Client(username, token);
}
