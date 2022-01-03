import {onMounted} from "vue";
import {useKeysStore} from "/@/store/keys";

export function useReloadOnKeyUpdate(
  resetCursor?: () => Promise<void>,
) {
  alert('TODO implement event bus')
  const keysStore = useKeysStore()

  onMounted(async () => {
    // EventBus.$on('key-updated', async name => {
    //   if (name !== this.name) {
    //     return
    //   }
    //
    //   if (resetCursor) {
    //     await resetCursor()
    //   }
    //
    //   keysStore.loadKeys()
    // })
  })
}
