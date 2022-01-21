import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VeeValidatePlugin from './includes/validation';
import { auth } from './includes/firebase';
import './assets/tailwind.css';
import './assets/main.css';

let app;
// wait firebase to initialize authenticate the user 
auth.onAuthStateChanged(() => {
   if (!app) {
      app = createApp(App);
      // The use method allow to register a plug-in
      app.use(store);
      app.use(router);
      app.use(VeeValidatePlugin);

      app.mount('#app');
   }
})