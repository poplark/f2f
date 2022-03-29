import * as md5 from 'md5';

export function encode(raw) {
  return md5(raw);
}
