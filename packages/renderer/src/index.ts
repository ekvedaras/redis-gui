import {createApp} from 'vue';
import App from '/@/App.vue';
import router from '/@/router';
import '../assets/index.css';

createApp(App)
  .use(router)
  .mount('#app');
