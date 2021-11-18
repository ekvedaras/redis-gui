import {createApp} from 'vue'
import App from '/@/App.vue'
import {key, store} from '/@/store'
import '../assets/index.css'

createApp(App)
  .use(store, key)
  .mount('#app');
