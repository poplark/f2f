<template>
  <div>
    <h1>Register</h1>

    <div>
      <input v-model="state.username" placeholder="用户名/手机号"/>
      <input type="password" v-model="state.password" placeholder="密码"/>
      <input type="password" v-model="state.confirm_password" placeholder="确认密码"/>
      <button @click="register">注册</button>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { encode } from '../utils/password';
import { register as registerUser } from '../utils/service';
import { router } from '../router';

export default {
  name: 'register',
  setup() {
    const state = reactive({
      username: '',
      password: '',
      confirm_password: '',
    });

    function register() {
      const { username, password, confirm_password } = state;

      if (!username || !password) {
        return;
      }

      if (password !== confirm_password) {
        return;
      }

      const passwd = encode(password);

      console.log('register:::: ', username, password, passwd);

      registerUser(username, passwd)
        .then((data) => {
          console.log('TODO - register succeed', data);
          router.replace('/login');
        })
        .catch((err) => {
          // todo - login failed tooltip
          console.error('TODO - register failed', err);
        });
    }
    return {
      state,
      register,
    }
  },
};
</script>
