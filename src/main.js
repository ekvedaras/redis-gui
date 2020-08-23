import Vue from 'vue'
import Toasted from 'vue-toasted'
import store from './store'
import './assets/tailwind.css'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Toasted)

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
