<script setup lang="ts">
import Spinner from '/@/components/Elements/Spinner.vue'
import type { ClickKeys } from 'types/models'
import { ref } from 'vue'

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

const emitInput = () => input.value && emit('update:value', input.value.value)
</script>

<template>
  <div v-shortkey="focusKeys.main" class="relative flex flex-1 justify-center items-center" @shortkey="input?.focus()">
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
