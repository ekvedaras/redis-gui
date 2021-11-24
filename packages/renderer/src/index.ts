import {createApp} from 'vue'
import App from '/@/App.vue'
import {key, store} from '/@/store'
import VueUniversalModal from 'vue-universal-modal'
import '../assets/index.css'

createApp(App)
  .use(store, key)
  .use(VueUniversalModal, {
    teleportTarget: '#modals',
  })
  .mount('#app');
