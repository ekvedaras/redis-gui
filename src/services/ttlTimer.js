import Vue from 'vue'

let ttlTimer

const timer = ({state, getters, commit}) =>
  Object
    .values(getters.keysWithTTL)
    .forEach(key => {
      state.keys[key.name].ttl--
      if (state.keys[key.name].ttl <= 0) {
        commit('removeKey', key)
        if (state.currentKey.name === key.name) {
          commit('unloadKey', key)
        }

        Vue.toasted.info(`Key ${key.name} has expired`)
      }
    })

export const registerTtlTimer = ({state, getters, commit}) => {
  if (ttlTimer) {
    return
  }

  ttlTimer = setInterval(() => timer({state, getters, commit}), 1000)
}

export const clearTtlTimer = () => {
  if (!ttlTimer) {
    return
  }

  clearInterval(ttlTimer)
}
