import Vue from 'vue'
import Vuex from 'vuex'
import servers from '@/store/servers'
import databases from '@/store/databases'
import keys from '@/store/keys'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    servers,
    databases,
    keys,
  },
})
