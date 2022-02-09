import type {Ref} from 'vue';
import {computed, ref} from 'vue';

export function useRegexFilter(value: Ref<string[]>) {
  const search = ref('')
  const filtered = computed(() => {
    if (!search.value.length) {
      return value.value;
    }

    const pattern = new RegExp(search.value, 'i');
    return value.value.filter(item => pattern.test(item));
  })

  return {
    search,
    filtered,
  }
}
