import { reactive } from 'vue';

export const currentUser = {
  state: reactive({
    info: null
  }),

  setUser(user) {
    console.log('set storeeeee ', user);
    this.state.info = user;
  }
}
