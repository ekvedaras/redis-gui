<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineProps<{
  value: string
}>()

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'save', value: string): void,
}>()

const editor = ref<HTMLTextAreaElement>()
onMounted(() => editor.value?.focus())

const emitSave = () => editor.value && emit('save', editor.value.value)
</script>

<template>
  <div>
    <!--suppress HtmlFormInputWithoutLabel -->
    <textarea
      ref="editor"
      :value="value"
      class="w-full h-64"
      @keydown.esc="emit('close')"
      @keydown.ctrl.enter="emitSave"
    />
    <span class="text-xs text-gray-500">CTRL + Enter to save, Esc to cancel</span>
  </div>
</template>
