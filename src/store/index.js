import { createStore } from 'vuex';

// This function will return an object which will act as a container for data (store)
export default createStore({
  state: { //global state data
    authModalShow: false
  },
  mutations: {
    toggleAuthModal: (state) => {
        state.authModalShow = !state.authModalShow
    }, 
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
  },
  actions: {
  },
  modules: {
  },
});
