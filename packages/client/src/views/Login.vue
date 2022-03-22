<template>
  <div>
    <h1>Login</h1>

    <div>
      <input v-model="state.username" placeholder="用户名/手机号"/>
      <input type="password" v-model="state.password" placeholder="密码"/>
      <button @click="login">登录</button>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import * as md5 from 'md5';
import { post } from '../utils/service';
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
    return {
      state,
      login,
    }
  },
};
</script>
