<template>
  <div>
    <my-header>
      <template v-slot:front>
        <span class="header-front">Test</span>
      </template>
    </my-header>

    <div>
      <input v-model="state.username" placeholder="用户名/手机号"/>
      <input type="password" v-model="state.password" placeholder="密码"/>
      <button @click="getToken">登录</button>
      <button @click="refreshToken">RefreshToken</button>
      <button @click="getUser">GetUser</button>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { encode } from '../utils/password';
import { get, getToken, refreshToken } from '../utils/service';
import { router } from '../router';

export default {
  name: 'test',
  setup() {
    const state = reactive({
      username: '',
      password: '',
    });

    function _getToken() {
      const { username, password } = state;

      if (!username || !password) {
        return;
      }

      const account = username;
      const passwd = encode(password);

      console.log('_getToken:::: ', username, password, passwd);

      getToken(account, passwd)
        .then((data) => {
          console.log('TODO - login succeed', data);
          router.replace('/');
        })
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
      getToken: _getToken,
      refreshToken: _refreshToken,
      getUser,
    }
  },
};
</script>
