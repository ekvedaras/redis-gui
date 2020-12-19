<template>
  <div class="bg-white dark:bg-gray-800 font-mono rounded shadow p-3 flex flex-col justify-center min-h-16">
    <div class="sticky right-0 text-right justify-end h-5" :class="[withKeys ? 'controls' : 'top-0']">
      <KeyItemControls
          @toggleWordBreak="toggleWordBreak"
          @toggleJson="$emit('toggleJson')"
          @edit="$emit('edit')"
          @delete="$emit('delete')"
          @copy="$emit('copy')"
          :without-delete="withoutDelete"
          :with-json="withJson"/>
    </div>
    <div :class="['overflow-x-auto -my-2', breakWords ? 'break-all' : 'whitespace-pre']">
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
    withJson: Boolean,
  },
  data: () => ({
    breakWords: false,
  }),
  methods: {
    toggleWordBreak () {
      this.breakWords = !this.breakWords
    },
  },
}
</script>

<style scoped>
.controls {
  top: 30px;
}
</style>
