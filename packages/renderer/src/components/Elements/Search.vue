<script setup lang="ts">
import Spinner from '/@/components/Elements/Spinner.vue'
import type { ClickKeys } from 'types/models'
import useHotKey from 'vue3-hotkey'
import { onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  value: string
  showSpinner: boolean
  focusKeys: ClickKeys,
}>(), {
  focusKeys: () => ({ main: ['/'] }) as ClickKeys,
})

const emit = defineEmits<{
  (e: 'update:value', value: string): void,
}>()

const input = ref<HTMLInputElement>()

onMounted(() => useHotKey([
  {
    keys: props.focusKeys.main,
    preventDefault: true,
    handler: () => input.value?.focus(),
  },
]))

const emitInput = () => input.value && emit('update:value', input.value.value)
</script>

<template>
  <div class="relative flex flex-1 justify-center items-center">
    <!--suppress HtmlFormInputWithoutLabel -->
    <input
      ref="input"
      type="text"
      placeholder="Search..."
      :value="props.value"
      class="py-2 px-3 w-full"
      @input="emitInput"
      @keydown.esc="blur"
    >
    <Spinner :class="[showSpinner ? 'opacity-100' : 'opacity-0']" />
  </div>
</template>
