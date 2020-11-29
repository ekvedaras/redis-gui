<template>
  <div class="bg-white dark:bg-gray-800 font-mono rounded shadow p-3 flex flex-col justify-center min-h-16">
    <div class="sticky right-0 text-right justify-end" :class="[withKeys ? 'controls' : 'top-0']">
      <KeyItemControls @edit="$emit('edit')" @delete="$emit('delete')" @copy="$emit('copy')" :without-delete="withoutDelete"/>
    </div>
    <div class="overflow-x-auto">
      {{ data }}
    </div>
    <div class="sticky bottom-0 right-0 text-right h-0 pb-5">
      <ValueSize :length="data.length"/>
    </div>
  </div>
</template>

<script>
import ValueSize from '@/components/Elements/ValueSize'
import KeyItemControls from '@/components/Elements/KeyItemControls'
export default {
  name: 'PlainRenderer',
  components: { KeyItemControls, ValueSize },
  props: {
    data: String,
    withoutDelete: Boolean,
    withKeys: Boolean,
  },
}
</script>

<style scoped>
  .controls {
    top: 30px;
  }
</style>
