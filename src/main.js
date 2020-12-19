import Vue from 'vue'
import Toasted from 'vue-toasted'
import VModal from 'vue-js-modal'
import store from './store'
import './assets/tailwind.css'
import App from './App.vue'
import Keys from '@/components/KeyList/Keys'
import '@/services/lodash'
import VTooltip from 'v-tooltip'
import ShortKey from 'vue-shortkey'
import VueClipboard from 'vue-clipboard2'
import VueFilterPrettyBytes from 'vue-filter-pretty-bytes'
import VueMoment from 'vue-moment'
import './titlebar'

Vue.config.productionTip = false

Vue.use(Toasted, {
  duration: 3000,
})

Vue.use(VueMoment)
Vue.use(VTooltip)
Vue.use(VueClipboard)
Vue.use(VueFilterPrettyBytes)
Vue.use(ShortKey, { prevent: ['input', 'textarea', 'select'] })
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
