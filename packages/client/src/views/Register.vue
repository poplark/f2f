<template>
    <my-header>
      <template v-slot:front>
        <span class="header-front">Register</span>
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
          <el-form-item label="密码确认">
            <el-input type="password" v-model="state.confirm_password" placeholder="请再次输入密码"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onRegister">注册</el-button>
            <el-button @click="onReset">重置</el-button>
            <el-button type="text" @click="onLogin">跳回登录页</el-button>
          </el-form-item>
          <p v-if="state.error">{{state.error}}</p>
        </el-form>
      </el-main>
    </el-container>
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
      error: null,
    });

    function onRegister() {
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
          state.error = err;
        });
    }
    function onReset() {
      state.username = '';
      state.password = '';
      state.confirm_password = '';
      state.error = '';
    }
    function onLogin() {
      router.push({ name: 'login'});
    }
    return {
      state,
      onRegister,
      onReset,
      onLogin,
    }
  },
};
</script>
