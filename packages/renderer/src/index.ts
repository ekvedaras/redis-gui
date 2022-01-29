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
// TODO: twitter and github logos should be at the bottom
// TODO: improve split pane UI
// TODO: add icon to show shortcuts modal
// TODO: info modal should not change height between tabs
// TODO: fix width scrollbars in doc modals
// TODO: fix console modal dimensions
// TODO: port window frame
// TODO: re-style toaster
// TODO: fix server edit modal not loading values
// TODO: should modals use v-if? Otherwise they are rendered before use so need to deal with unset values
// TODO: fix changing databases
// TODO: solve lint and vue-tsc issues
// TODO: should connection test be done in preload?
