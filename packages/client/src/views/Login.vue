<template>
  <div>
    <h1>Login</h1>

    <div>
      <input @change="onUsernameChange" placeholder="用户名/手机号"/>
      <input type="password" @change="onPasswordChange" placeholder="密码"/>
      <button @click="login">登录</button>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { post } from '../utils/service';
import { router } from '../router';

export default {
  name: 'login',
  setup() {
    const state = reactive({
      username: '',
      password: '',
    });

    // todo - debounce
    function onUsernameChange(v) {
      console.log('username ', v);
    }
    // todo - debounce
    function onPasswordChange(v) {
      console.log('password ', v);
    }

    function login() {
      const { username, password } = state;
      const account = username;
      const passwd = password;

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
      onUsernameChange,
      onPasswordChange,
      login,
    }
  },
};
</script>
