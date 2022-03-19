import type {Ref} from 'vue';
import {onMounted, ref} from 'vue'
import {useRedis} from '/@/use/redis'

type RangeType = 'lRange'
type LengthType = 'lLen'

export function usePointerScanner(name: string, rangeUsing: RangeType, measureUsing: LengthType, value: Ref<string[]>) {
  const isLoading = ref(true)
  const pointer = ref(0)
  const size = ref(0)

  const redis = useRedis()

  const loadKeys = async (start = 0, limit = redis.pageSize) => {
    isLoading.value = true;
    try {
      const result = await redis.client.sendCommand([rangeUsing, name, String(start), String(start + limit - 1)]) as string[]


      if (pointer.value + result.length < size.value) {
        pointer.value = pointer.value + result.length
      } else {
        pointer.value = 0
      }

      if (pointer.value) {
        result.forEach(item => value.value.push(item))
      } else {
        value.value = result
      }
    } finally {
      isLoading.value = false;
    }
  }

  const loadMore = () => loadKeys(pointer.value)

  onMounted(async () => {
    size.value = await redis.client.sendCommand([measureUsing, name])
    pointer.value = 0
    await loadKeys()
  })

  return {
    isLoading,
    pointer,
    size,
    loadKeys,
    loadMore,
  }
}
