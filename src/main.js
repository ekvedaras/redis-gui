import Vue from 'vue'
import Toasted from 'vue-toasted'
import VModal from 'vue-js-modal'
import store from './store'
import './assets/tailwind.css'
import App from './App.vue'
import Keys from '@/components/KeyList/Keys'
import '@/services/lodash'

Vue.config.productionTip = false

Vue.use(Toasted, {
  duration: 3000,
})

Vue.use(require('vue-moment'))
Vue.use(VModal, {
  dialog: false,
  dynamicDefaults: {
    focusTrap: true,
    resizable: true,
    height: 'auto',
  },
})

Vue.component('Keys', Keys)

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
