import type {Store} from 'vuex'
import {createStore, useStore as baseUseStore} from 'vuex'
import type {DatabasesState} from '/@/store/databases'
import {databasesStore} from '/@/store/databases'
import type {InjectionKey} from 'vue'

export interface State {
  databases: DatabasesState,
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  modules: {
    databases: databasesStore,
  },
})

export function useStore() {
  return baseUseStore(key)
}
