import Vue from 'vue'

let ttlTimer;

const timer = ({ state, getters, commit }) => Object
  .values(getters.keysWithTTL)
  .forEach(key => {
    state.keys[key.name].ttl--
    if (state.keys[key.name].ttl <= 0) {
      if (state.selected === key.name) {
        commit('unloadKey', key)
      }

      commit('removeKey', key)

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
  ttlTimer = 0;
}
