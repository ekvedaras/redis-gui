import {onMounted} from "vue";
import {useKeysStore} from "/@/store/keys";
import useEmitter from "/@/use/emitter";

export function useReloadOnKeyUpdate(
  name: string,
  resetCursor?: () => Promise<void>,
) {
  const keysStore = useKeysStore()
  const emitter = useEmitter()

  onMounted(async () => {
    emitter.on('key-updated', async (updatedKey: string) => {
      if (updatedKey !== name) {
        return
      }

      if (resetCursor) {
        await resetCursor()
      }

      await keysStore.loadKeys()
    })
  })
}
