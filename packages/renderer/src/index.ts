import {createApp} from 'vue'
import App from '/@/App.vue'
import VueUniversalModal from 'vue-universal-modal'
import 'vue-universal-modal/dist/index.css'
import '../assets/index.css'
import {createPinia} from 'pinia'

createApp(App)
  .use(createPinia())
  .use(VueUniversalModal, {
    teleportTarget: '#modals',
  })
  .mount('#app');
