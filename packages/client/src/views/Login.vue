<template>
    <my-header>
      <template v-slot:front>
        <span class="header-front">Login</span>
      </template>
    </my-header>
    <el-container>
      <el-header></el-header>
      <el-main>
        <el-form :model="state" label-width="120px">
          <el-form-item label="用户名/手机号">
            <el-input v-model="state.username" placeholder="请输入用户名"/>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="state.password" placeholder="请输入密码"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onLogin">登录</el-button>
            <el-button type="text" @click="onRegister">注册</el-button>
          </el-form-item>
          <p v-if="state.error">{{state.error}}</p>
        </el-form>
      </el-main>
    </el-container>
</template>

<script>
import { reactive } from 'vue';
import { encode } from '../utils/password';
import { getToken } from '../utils/service';
import { router } from '../router';

export default {
  name: 'login',
  setup() {
    const state = reactive({
      username: '',
      password: '',
    });

    function onLogin() {
      const { username, password } = state;

      if (!username || !password) {
        return;
      }

      const account = username;
      const passwd = encode(password);

      console.log('onLogin:::: ', username, password, passwd);

      getToken(account, passwd)
        .then((data) => {
          console.log('TODO - login succeed', data);
          router.replace('/');
        })
        .catch((err) => {
          state.error = err;
        });
    }
    function onRegister() {
      router.push({ name: 'register'});
    }
    return {
      state,
      onLogin,
      onRegister,
    }
  },
};
</script>
