<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        Profile
      </el-header>
      <el-main>
        <el-form v-if="state.user" :model="state.user" label-width="120px">
          <el-form-item label="用户名">
            <el-input disabled v-model="state.user.username"/>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch
              disabled
              v-model="state.user.active"
              active-text="激活"
             inactive-text="锁定"
            />
          </el-form-item>
          <el-form-item label="角色">
            <el-input readonly v-model="state.user.role"/>
          </el-form-item>
        </el-form>
        <el-button @click="onHome">返回主页</el-button>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import { get } from '../utils/service';
import { router } from '../router';

export default {
  name: 'profile',
  setup() {
    const state = reactive({
      user: null,
    });

    function getUser() {
      get('/user')
        .then((data) => {
          state.user = data;
        })
        .catch(() => {
          router.replace('/login');
        });
    }

    function onHome() {
      router.push({name: 'home'});
    }

    onMounted(() => {
      getUser();
    });
    return {
      state,
      getUser,
      onHome,
    }
  },
};
</script>
