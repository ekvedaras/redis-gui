import {createApp} from 'vue'
import App from '/@/App.vue'
import VueUniversalModal from 'vue-universal-modal'
import 'vue-universal-modal/dist/index.css'
import '../assets/index.css'
import {createPinia} from 'pinia'
import mitt from 'mitt'

const app = createApp(App)
  .use(createPinia())
  .use(VueUniversalModal, {
    teleportTarget: '#modals',
  })

app.config.globalProperties.emitter = mitt()

app.mount('#app');
