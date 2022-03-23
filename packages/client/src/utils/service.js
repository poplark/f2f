import { decode } from 'js-base64';

let token = '';
let expires = 0;

function isExpired() {
  return expires === 0 || Date.now() >= expires * 1000;
}
function isNearExpired() {
  // 少于 1 小时，就自动刷新 token
  console.log('Now::: ', Date.now(), expires, expires * 1000 - Date.now());
  return expires * 1000 - Date.now() < 6 * 1000;
}

function updateExpires(token) {
  try {
    const infoCode = token.split('.')[1];
    expires = JSON.parse(decode(infoCode)).exp;
  } catch (err) {
    throw new Error('invalid token');
  }
}

function _get(path) {
  return fetch('/api' + path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then((resp) => {
    const data = resp.json();
    console.log('get:: ', data);
    return data;
  });
}

function _post(path, data) {
  return fetch('/api' + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data)
  }).then((resp) => {
    const data = resp.json();
    console.log('post:: ', data);
    return data;
  });
}

function request(method, ...args) {
  if (isExpired()) {
    return Promise.reject('token expired');
  }
  if (isNearExpired()) {
    return refreshToken().then(() => method(...args));
  }
  return method(...args);
}

export function get(path) {
  return request(_get, path);
}

export function post(path, data) {
  return request(_post, path, data);
}

export function rawGet(path) {
  return fetch(path)
    .then((resp) => {
      const data = resp.json();
      console.log('get:: ', data);
      return data;
    });
}

export async function getToken(username, password) {
  return fetch('/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((resp) => resp.json()
  ).then((data) => {
    console.log('token:: ', data);
    token = data.token;
    updateExpires(token);
  });
}
export function refreshToken() {
  return fetch('/api/refreshToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }).then((resp) => resp.json()
  ).then((data) => {
    console.log('refreshToken:: ', data);
    token = data.token;
    updateExpires(token);
  });
}
