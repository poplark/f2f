<template>
  <div>
    <h1>Home</h1>

    <div>
      {{ state.user }}
      <button @click="getUser">Info</button>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { get } from '../utils/service';
import { router } from '../router';

export default {
  name: 'home',
  setup() {
    const state = reactive({
      user: null,
    });

    function getUser() {
      get('/user')
        .then((data) => {
          console.log('TODO - home succeed', data);
          state.user = data;
        })
        .catch((err) => {
          // todo - login failed tooltip
          console.error('TODO - home failed', err);
          router.replace('/login');
        });
    }
    return {
      state,
      getUser,
    }
  },
};
</script>
