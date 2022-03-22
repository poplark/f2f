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
    data: JSON.stringify(data)
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
