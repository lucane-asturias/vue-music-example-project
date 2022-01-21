import { createStore } from 'vuex';
// '@' is an alias for /src
import { auth, usersCollection } from '@/includes/firebase';

// This function will return an object which will act as a container for data (store)
export default createStore({
  state: { //global state data
    authModalShow: false,
    userLoggedIn: false
  },
  mutations: {
    toggleAuthModal: (state) => {
        state.authModalShow = !state.authModalShow
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn
    }
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
  },
  actions: {
    // function that will register the user in both the authentication and firestore services
    async register({ commit }, payload) {
      // both values are store in the payload parameter provided by the submit event
      const userCred = await auth.createUserWithEmailAndPassword(payload.email, payload.password);
      // connect user's data in the database to their authenticated account assigning an id
      await usersCollection.doc(userCred.user.uid).set({
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country
      });

      await userCred.user.updateProfile({ // update user's profile data
        displayName: payload.name,
      })

      // toggle authentication mutation
      commit('toggleAuth')
    },
    async login({ commit }, payload) {
      // send request to firebase with the payload data
      auth.signInWithEmailAndPassword(payload.email, payload.password);

      commit('toggleAuth');
    },
    init_login({ commit }) {
      const user = auth.currentUser; // get the curent user connected 

      if (user) {
        commit('toggleAuth');
      }
    },
    async signout({ commit }) {
      // signing user out from firebase
      await auth.signOut();

      commit('toggleAuth');
    },
  },
  modules: {
  },
});
