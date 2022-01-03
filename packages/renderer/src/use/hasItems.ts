import {computed, Ref} from 'vue'

export function useHasItems(value: Ref) {
  return computed(() => {
    if (typeof value.value === 'object') {
      return !!Object.keys(value.value).length
    }

    return !!value.value.length
  })
}
