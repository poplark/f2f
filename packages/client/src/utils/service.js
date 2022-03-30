import { decode } from 'js-base64';

let access_token = '';
let refresh_token = '';
let expires = 0;
let isRefreshingToken = false;
const requests = [];

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

export async function register(username, password) {
  return fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then(async (resp) => {
    if (resp.ok) {
      return resp.json();
    } else {
      const res = await resp.json();
      throw new Error(res.zh);
    }
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
    console.log('accessToken:: ', data);
    access_token = data.accessToken;
    refresh_token = data.refreshToken;
    updateExpires(access_token);
  });
}
export async function refreshToken() {
  return fetch('/api/refreshToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken: refresh_token,
    }),
  }).then((resp) => resp.json()
  ).then((data) => {
    console.log('refreshToken:: ', data);
    access_token = data.accessToken;
    refresh_token = data.refreshToken;
    updateExpires(access_token);
  });
}

function request(method, ...args) {
  if (isRefreshingToken) {
    return new Promise((resolve, reject) => {
      requests.push([resolve, reject]);
    }).then(() => {
      return method(...args);
    });
  }
  if (isExpired()) {
    return refresh();
  }
  return method(...args).catch((err) => {
    console.warn('request failed:: ', err);
    if (err.message === '401') {
      return refresh();
    } else {
      throw err;
    }
  });
  function refresh() {
    isRefreshingToken = true;
    return refreshToken().catch((err) => {
      // todo - jump to login page
      isRefreshingToken = false;
      requests.forEach((item) => {
        const [_, reject] = item;
        reject();
      });
      throw err;
    }).then(() => {
      isRefreshingToken = false;
      requests.forEach((item) => {
        const [resolve] = item;
        resolve();
      });
      return method(...args);
    });
  }
}

function _get(path) {
  return fetch('/api' + path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`,
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then((resp) => {
    if (resp.ok) {
      return resp.json();
    // } else if (resp.status === 401) {
    } else {
      throw new Error(resp.status);
    }
  });
}

function _post(path, data) {
  return fetch('/api' + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`,
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data)
  }).then(async (resp) => {
    if (resp.ok) {
      return resp.json();
    // } else if (resp.status === 401) {
    } else {
      throw new Error(resp.status);
    }
  });
}

function isExpired() {
  return expires === 0 || Date.now() >= expires * 1000;
}

function updateExpires(token) {
  try {
    const infoCode = token.split('.')[1];
    expires = JSON.parse(decode(infoCode)).exp;
  } catch (err) {
    throw new Error('invalid token');
  }
}
