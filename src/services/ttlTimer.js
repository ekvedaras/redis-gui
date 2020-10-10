import Vue from 'vue'

let ttlTimer

const timer = ({ state, getters, commit }) => Object
  .values(getters['keys/withTTL'])
  .forEach(key => {
    state.list[key.name].ttl--
    if (state.list[key.name].ttl <= 0) {
      if (state.selected === key.name) {
        commit('keys/unloadKey', key)
      }

      commit('keys/removeKey', key)

      Vue.toasted.info(`Key ${key.name} has expired`)
    }
  })

export const registerTtlTimer = ({ state, store }) => {
  if (ttlTimer) {
    return
  }

  ttlTimer = setInterval(() => timer({ ...store, state }), 1000)
}

export const clearTtlTimer = () => {
  if (!ttlTimer) {
    return
  }

  clearInterval(ttlTimer)
  ttlTimer = 0
}
