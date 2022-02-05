import {createApp} from 'vue'
import App from '/@/App.vue'
import VueUniversalModal from 'vue-universal-modal'
import 'vue-universal-modal/dist/index.css'
import FloatingVue from 'floating-vue'
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

app.config.globalProperties.emitter = mitt()

app.mount('#app');

// TODO: fix dark mode
// TODO: fix key content searchbar actually searching keys sidebar
// TODO: improve split pane UI
// TODO: add icon to show shortcuts modal
// TODO: re-style toaster
// TODO: fix issues with nested modals when child gets closed
// TODO: fix changing databases
// TODO: solve lint and vue-tsc issues
// TODO: should connection test be done in preload?
// TODO: port NOPERM workaround
// TODO: shortkeys should be off when inputs are in focus
