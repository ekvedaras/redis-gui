import type {Ref} from 'vue';
import {computed} from 'vue'

export function useHasItems(value: Ref) {
  return computed(() => {
    if (typeof value.value === 'object') {
      return !!Object.keys(value.value).length
    }

    return !!value.value.length
  })
}
