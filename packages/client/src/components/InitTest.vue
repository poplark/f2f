<script>
import { reactive } from 'vue'
import { rawGet as get } from '../utils/service'
export default {
  name: 'InitTest',
  setup(){

    const state = reactive({
      type: '',
      data: null
    })

    function initPermission() {
      get(`/init-test/permission`).then((data) => {
        console.log('Permission:: ', data);
        state.type = 'Permission';
        state.data = data;
      }).catch((err) => {
        // todo - error boundary
        console.error('Permission:: ', err);
      });
    }

    function initRole() {
      get(`/init-test/role`).then((data) => {
        console.log('Role:: ', data);
        state.type = 'Role';
        state.data = data;
      }).catch((err) => {
        // todo - error boundary
        console.error('Role:: ', err);
      });
    }

    function addUser(username) {
      let url = `/init-test/adduser`;
      if (username) {
        url += '?username=' + username;
      }
      get(url).then((data) => {
        console.log('User:: ', data);
        state.type = 'User';
        state.data = data;
      }).catch((err) => {
        // todo - error boundary
        console.error('User:: ', err);
      });
    }

    return {
      state,
      initPermission,
      initRole,
      addUser,
    }
  }
}
</script>

<template>
<div>
  <div>
    <button @click="initPermission">Permission</button>
    <button @click="initRole">Role</button>
    <button @click="addUser">User</button>
  </div>
  <div class="init-test">
    <p> {{state.type}} ::</p>
    <p> {{state.data}} </p>
  </div>
</div>
</template>

<style scoped>
.init-test {
  background-color: #eee;
}
</style>
