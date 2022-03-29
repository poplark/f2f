<template>
  <div>
    <h1>Login</h1>

    <div>
      <input v-model="state.username" placeholder="用户名/手机号"/>
      <input type="password" v-model="state.password" placeholder="密码"/>
      <button @click="login">登录</button>
      <button @click="getToken">Token</button>
      <button @click="refreshToken">RefreshToken</button>
      <button @click="getUser">GetUser</button>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import * as md5 from 'md5';
import { get, post, getToken, refreshToken } from '../utils/service';
import { router } from '../router';

export default {
  name: 'login',
  setup() {
    const state = reactive({
      username: '',
      password: '',
    });

    function login() {
      const { username, password } = state;

      if (!username || !password) {
        return;
      }

      const account = username;
      const passwd = md5(password);

      console.log('login:::: ', username, password, passwd);

      return token(account, passwd);
      post('/login', {account, passwd})
        .then((data) => {
          console.log('TODO - login succeed', data);
          router.replace('/');
        })
        .catch((err) => {
          // todo - login failed tooltip
          console.error('TODO - login failed', err);
        });
    }
    function _getToken() {
      const { username, password } = state;

      if (!username || !password) {
        return;
      }

      const account = username;
      const passwd = md5(password);

      console.log('_getToken:::: ', username, password, passwd);

      getToken(account, passwd)
        .catch((err) => {
          console.error('_getToken::: ', err);
        });
    }
    function _refreshToken() {
      refreshToken()
        .catch((err) => {
          console.error('_refreshToken::: ', err);
        });
    }
    function getUser() {
      const { username } = state;

      if (!username) {
        return;
      }
      get(`/user?username=${username}`)
        .then((data) => {
          console.log('get user::: ', data);
        })
        .catch((err) => {
          console.error('get user::: ', err);
        });
      get(`/user?username=${username}`)
        .then((data) => {
          console.log('get user222::: ', data);
        })
        .catch((err) => {
          console.error('get user222::: ', err);
        });
      get(`/user?username=${username}`)
        .then((data) => {
          console.log('get user333::: ', data);
        })
        .catch((err) => {
          console.error('get user333::: ', err);
        });
      get(`/user?username=${username}`)
        .then((data) => {
          console.log('get user444::: ', data);
        })
        .catch((err) => {
          console.error('get user444::: ', err);
        });
    }
    return {
      state,
      login,
      getToken: _getToken,
      refreshToken: _refreshToken,
      getUser,
    }
  },
};
</script>
