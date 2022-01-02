<template>
  <div>
    <!--suppress HtmlFormInputWithoutLabel -->
    <textarea ref="editor"
              :value="value"
              @input="emit('input', $event.target.value)"
              @keydown.esc="emit('close')"
              @keydown.ctrl.enter="emit('save')"
              class="w-full h-64" />
    <span class="text-xs text-gray-500">CTRL + Enter to save, Esc to cancel</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  value: string
}>()

const emit = defineEmits<{
  (e: 'input', value: string): void,
  (e: 'close'): void,
  (e: 'save'): void,
}>()

const editor = ref<HTMLTextAreaElement>()
onMounted(() => editor.value?.focus())
</script>

<style scoped>

</style>
