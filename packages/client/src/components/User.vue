<script>
import { reactive } from 'vue'
import { get } from '../utils/service'
export default {
  name: 'User',
  setup(){

    const state = reactive({
      username: '',
      userInfo: null,
    })

    function loadData(){
      const { id, username } = state;
      if (id) {
        get(`/user/${id}`).then((data) => {
          console.log('get user ::', data)
          state.userInfo = data;
        })
        return;
      }
      get(`/user?username=${username}`).then((data) => {
        console.log('get user ::', data)
        state.userInfo = data;
      })
    }
    return {
      state,
      loadData
    }
  }
}
</script>

<template>
  <div class="home" @click="loadData">
    <input v-model="state.id" placeholder="input an ID" />
    <input v-model="state.username" placeholder="input a username" />
    <button @click="loadData">Load</button>
    <div>
      <span>User: </span>
      <div v-if="state.userInfo">
        <p>Username: {{state.userInfo.username}}</p>
        <p>ID: {{state.userInfo.id}}</p>
        <p>Active: {{state.userInfo.active}}</p>
        <p>Password: {{state.userInfo.password_hash}}</p>
        <p>Role: {{state.userInfo.role}}</p>
        <p>UpdatedAt: {{state.userInfo.updatedAt}}</p>
        <p>CreatedAt: {{state.userInfo.createdAt}}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
