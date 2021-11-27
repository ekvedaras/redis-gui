import {createApp} from 'vue'
import App from '/@/App.vue'
import VueUniversalModal from 'vue-universal-modal'
import '../assets/index.css'

createApp(App)
  .use(VueUniversalModal, {
    teleportTarget: '#modals',
  })
  .mount('#app');
