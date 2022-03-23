export function get(path) {
  return fetch('/api' + path)
    .then((resp) => {
      const data = resp.json();
      console.log('get:: ', data);
      return data;
    });
}

export function post(path, data) {
  return fetch('/api' + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data)
  }).then((resp) => {
    const data = resp.json();
    console.log('post:: ', data);
    return data;
  });
}

export function rawGet(path) {
  return fetch(path)
    .then((resp) => {
      const data = resp.json();
      console.log('get:: ', data);
      return data;
    });
}

let token = '';
let maxAge = 24 * 60 * 60;
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
    maxAge = data.maxAge;
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
    maxAge = data.maxAge;
  });
}
