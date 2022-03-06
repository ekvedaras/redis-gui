import {createApp} from 'vue'
import App from '/@/App.vue'
import VueUniversalModal from 'vue-universal-modal'
import 'vue-universal-modal/dist/index.css'
import FloatingVue from 'floating-vue'
import Shortkey from 'vue3-shortkey'
import 'floating-vue/dist/style.css'
import '../assets/index.css'
import {createPinia} from 'pinia'
import mitt from 'mitt'

const app = createApp(App)
  .use(createPinia())
  .use(FloatingVue)
  .use(VueUniversalModal, {
    teleportTarget: '#modals',
  })
  .use(Shortkey, {
    prevent: ['input', 'textarea'],
  })

app.config.globalProperties.emitter = mitt()

app.mount('#app');

// TODO: fix randomly failing first load (the works after clicking cmd + r) <-- probably only relevant during dev as maybe preload/dist/index.js is still compiling
// TODO: fix finicky connection status indicator (and some client closed errors when switching servers)
// TODO: port NOPERM workaround
// TODO: do not expect default server to always be there. On first install show add server dialog #25
