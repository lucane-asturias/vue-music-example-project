import { createStore } from 'vuex';
import { auth, usersCollection } from '@/includes/firebase';
import { Howl } from 'howler'; // use to create a new audio object
import helper from '@/includes/helper';

// This function will return an object which will act as a container for data (store)
export default createStore({
  state: { //global state data
    authModalShow: false,
    userLoggedIn: false,
    currentSong: {},
    song: {},
    seek: '00:00', // current position
    duration: '00:00',
    playerProgress: '0%',
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn
    },
    newSong(state, payload) {
      state.currentSong = payload;
      state.song = new Howl({
        src: [payload.url], // src of audio files to play
        html5: true,
      });
    },
    updatePosition(state) {
      // seek fc will return the current position of the audio being played
      state.seek = helper.formatTime(state.song.seek());
      state.duration = helper.formatTime(state.song.duration())
      state.playerProgress = `${(state.song.seek() / state.song.duration()) * 100}%`;
    },
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
    playing: (state) => {
      if (state.song.playing) {
        return state.song.playing();
      }

      return false;
    },
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
      await auth.signInWithEmailAndPassword(payload.email, payload.password);
      
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
    async newSong({ state, commit, dispatch }, payload) {
      if (state.song instanceof Howl) {
        // circunvent memory leaking issues
        state.song.unload(); // pause the current song, delete the instance
      }

      commit('newSong', payload);

      state.song.play();

      state.song.on('play', () => {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      });
    },
    async toggleAudio({ state }) {
      if (!state.song.playing) { // if the function not exists on the object
        return;
      }
      // if it is playing, pause the audio
      if (state.song.playing()) { 
        state.song.pause();
      } else {
        state.song.play();
      }
    },
    progress({ commit, state, dispatch }) {
      commit('updatePosition')

      if (state.song.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
    updateSeek({ state, dispatch }, payload) {
      if (!state.song.playing) {
        return;
      }

      const { x, width } = payload.currentTarget.getBoundingClientRect();
      const clickX = payload.clientX - x; // calculation to get the correct coordenate clicked
      const percentage = clickX / width;
      const seconds = state.song.duration() * percentage;

      state.song.seek(seconds); // update current position of the audio

      state.song.once('seek', () => {
        dispatch('progress'); // update player
      });

    },
  },
  modules: {
  },
});
