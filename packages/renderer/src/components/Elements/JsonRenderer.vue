<template>
  <div class="bg-white dark:bg-gray-800 font-mono rounded shadow p-3 flex flex-col overflow-y-auto justify-center min-h-16">
    <div v-if="!withoutControls" class="sticky right-0 text-right flex justify-end z-10 h-5" :class="[withKeys ? 'controls' : 'top-0']">
      <KeyItemControls
        @edit="emit('edit')"
        @delete="emit('delete')"
        @copy="emit('copy')"
        @toggleJson="emit('toggleJson')"
        without-word-break
        with-json
        :without-delete="withoutDelete" />
    </div>
    <vue-json-pretty
      :data="JSON.parse(data)"
      :deep="4"
      highlight-mouseover-node
      show-length
      class="-my-5"
    />
    <div class="sticky bottom-0 right-0 text-right h-0 pb-5">
      <ValueSize :length="data.length" />
    </div>
  </div>

</template>

<script setup lang="ts">
import ValueSize from '/@/components/Elements/ValueSize.vue'
import { defineEmits } from 'vue'
import KeyItemControls from '/@/components/Elements/KeyItemControls.vue'

const props = withDefaults(defineProps<{
  data: string;
  withoutControls?: boolean;
  withoutDelete?: boolean;
  withKeys?: boolean;
}>(), {
  withoutControls: false,
  withoutDelete: false,
  withKeys: false,
})

const emit = defineEmits<{
  (e: 'edit'): void,
  (e: 'delete'): void,
  (e: 'copy'): void,
  (e: 'toggleJson'): void,
}>()
</script>

<style>
.vjs-key {
  white-space: nowrap;
}

@screen dark {
  .vjs-tree.is-mouseover {
    background-color: theme('colors.gray.900');
  }

  .controls {
    top: 30px;
  }
}
</style>
