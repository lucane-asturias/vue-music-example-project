import { createStore } from 'vuex';
// import auth from './modules/auth';
// import player from './modules/player';
import modules from './modules';

// will return an object which will act as a container for data (store)
export default createStore({
  modules, /*: {
    auth,
    player
  },*/
});
