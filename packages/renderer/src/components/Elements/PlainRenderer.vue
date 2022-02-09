<template>
  <div class="bg-white dark:bg-gray-800 font-mono rounded shadow p-3 flex flex-col justify-center min-h-16">
    <div class="sticky right-0 text-right justify-end h-5" :class="[withKeys ? 'controls' : 'top-0']">
      <KeyItemControls
        :without-delete="withoutDelete"
        :with-json="withJson"
        @toggle-word-break="toggleWordBreak"
        @toggle-json="emit('toggleJson')"
        @edit="emit('edit')"
        @delete="emit('delete')"
        @copy="emit('copy')"
      />
    </div>
    <div :class="['overflow-x-auto', breakWords ? 'break-all' : 'whitespace-pre']">
      {{ data }}
    </div>
    <div class="sticky bottom-0 right-0 text-right h-0 pb-5">
      <ValueSize :length="data.length" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ValueSize from '/@/components/Elements/ValueSize.vue'
import KeyItemControls from '/@/components/Elements/KeyItemControls.vue'

defineProps<{
  data: string
  withJson: boolean
  withoutDelete: boolean
  withKeys: boolean
}>()

const emit = defineEmits<{
  (e: 'edit'): void,
  (e: 'delete'): void,
  (e: 'copy'): void,
  (e: 'toggleJson'): void,
}>()

const breakWords = ref(false)

const toggleWordBreak = () => {
  breakWords.value = !breakWords.value
}
</script>

<style scoped>
.controls {
  top: 30px;
}
</style>
