import {onMounted, ref, watch} from 'vue'
import {useKeysStore} from '/@/store/keys'
import {useRedis} from '/@/use/redis'
import {StringArray} from "../../types/models";

type ScanType = 'scan' | 'sscan' | 'hscan' | 'zscan'

interface Result {
  0: string, // cursor
  1: string[], // data
  nextCursor?: number,
  lastLoad?: number,
}

export function useCursorScanner(name: string, scanUsing: ScanType, setValueUsing: (value: string[] | StringArray, shouldMerge: boolean) => void) {
  const search = ref('')
  const isLoading = ref(true)
  const nextCursor = ref(0)

  const keysStore = useKeysStore()
  const redis = useRedis()

  watch(() => search.value, () => {
    let wildcard = search.value.indexOf('*') > -1 ? '' : '*'
    keysStore.loadKeys(`${wildcard}${search.value}${wildcard}`)
  })

  const loadKeys = async (pattern = '*', cursor = 0, limit = redis.pageSize, lastLoad = 0): Promise<Result | null> => {
    isLoading.value = true
    await keysStore.loadKeyInfo(name)
    try {
      const result = await redis.client.sendCommand([scanUsing, name, cursor, 'MATCH', pattern, 'COUNT', limit]) as Result
      result.lastLoad = Object.keys(result[1]).length
      nextCursor.value = parseInt(result[0])

      setValueUsing(result[1], cursor > 0)

      if (result.nextCursor && lastLoad + result.lastLoad < limit) {
        return loadKeys(pattern, result.nextCursor, limit, lastLoad + Object.keys(result[1]).length)
      }

      return result
    } finally {
      isLoading.value = false
    }

    return null
  }

  const loadMore = () => loadKeys(`*${search.value}*`, nextCursor.value)

  onMounted(() => loadKeys())

  return {
    search,
    isLoading,
    nextCursor,
    loadKeys,
    loadMore,
  }
}
