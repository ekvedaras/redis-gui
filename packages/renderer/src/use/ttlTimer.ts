import {useKeysStore} from '/@/store/keys'
import {useToaster} from '/@/use/toaster'

let ttlTimer: NodeJS.Timer | undefined

const keysStore = useKeysStore()
const toaster = useToaster()

const tick = () => Object
  .values(keysStore.withTTL)
  .forEach(key => {
    keysStore.list[key.name].ttl--
    if (keysStore.list[key.name].ttl <= 0) {
      if (keysStore.selected === key.name) {
        keysStore.selected = undefined
      }

      delete keysStore.list[key.name]

      toaster.info(`Key ${key.name} has expired`)
    }
  })


export const useTtlTimer = () => ({
  registerTtlTimer() {
    if (ttlTimer) {
      return
    }

    ttlTimer = setInterval(() => tick(), 1000)
  },
  clearTtlTimer() {
    if (!ttlTimer) {
      return
    }

    clearInterval(ttlTimer)
    ttlTimer = undefined
  },
})
