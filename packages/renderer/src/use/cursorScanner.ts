import {onMounted, ref, watch} from 'vue'
import {useKeysStore} from '/@/store/keys'
import {useRedis} from '/@/use/redis'
import type {Tuple, ZMember} from '../../types/models'

type ScanType = 'scan' | 'sScan' | 'hScan' | 'zScan'

interface Result {
  cursor: number,
  members?: string[] | ZMember[]
  tuples?: Tuple[],
  nextCursor?: number,
  lastLoad?: number,
}

export function useCursorScanner(name: string, scanUsing: ScanType, setValueUsing: (value: string[] | ZMember[] | Tuple[], shouldMerge: boolean) => void) {
  const search = ref('')
  const isLoading = ref(true)
  const nextCursor = ref(0)

  const keysStore = useKeysStore()
  const redis = useRedis()

  watch(() => search.value, () => {
    const wildcard = search.value.indexOf('*') > -1 ? '' : '*'
    keysStore.loadKeys(`${wildcard}${search.value}${wildcard}`)
  })

  const loadKeys = async (pattern = '*', cursor = 0, limit = redis.pageSize, lastLoad = 0): Promise<Result | null> => {
    isLoading.value = true
    await keysStore.loadKeyInfo(name)
    try {
      const result = await redis.client[scanUsing](name, cursor, {MATCH: pattern, COUNT: limit}) as Result
      result.lastLoad = result.members?.length ?? Object.keys(result.tuples ?? {}).length
      nextCursor.value = result.cursor

      setValueUsing(result.members ?? result.tuples ?? [], cursor > 0)

      if (result.nextCursor && lastLoad + result.lastLoad < limit) {
        return loadKeys(pattern, result.nextCursor, limit, lastLoad + result.lastLoad)
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
