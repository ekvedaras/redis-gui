import {createApp} from 'vue'
import App from '/@/App.vue'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import '../assets/index.css'
import {createPinia} from 'pinia'
import mitt from 'mitt'

const app = createApp(App)
  .use(createPinia())
  .use(FloatingVue)

app.config.globalProperties.emitter = mitt()

app.mount('#app');
