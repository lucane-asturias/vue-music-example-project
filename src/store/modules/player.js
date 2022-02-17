import { Howl } from 'howler'; // use to create a new audio object
import helper from '@/includes/helper';

export default {
  state: {
    currentSong: {},
    song: {},
    seek: '00:00', // current position
    duration: '00:00',
    playerProgress: '0%',
  },
  getters: {
    playing: (state) => {
      if (state.song.playing) {
        return state.song.playing();
      }

      return false;
    },
  },
  mutations: {
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
  actions: {
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
  }
};