<template>
  <div class="bg-white dark:bg-gray-800 font-mono rounded shadow p-3 flex flex-col justify-center min-h-16">
    <div v-if="!withoutControls" class="sticky right-0 text-right flex justify-end z-10 h-5" :class="[withKeys ? 'controls' : 'top-0']">
      <KeyItemControls
          @edit="$emit('edit')"
          @delete="$emit('delete')"
          @copy="$emit('copy')"
          @toggleJson="$emit('toggleJson')"
          without-word-break
          with-json
          :without-delete="withoutDelete"/>
    </div>
    <vue-json-pretty
        :data="JSON.parse(data)"
        :deep="4"
        highlight-mouseover-node
        show-length
        class="-my-5"
    />
    <div class="sticky bottom-0 right-0 text-right h-0 pb-5">
      <ValueSize :length="data.length"/>
    </div>
  </div>

</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import ValueSize from '@/components/Elements/ValueSize'
import KeyItemControls from '@/components/Elements/KeyItemControls'

export default {
  name: 'JsonRenderer',
  components: { KeyItemControls, ValueSize, VueJsonPretty },
  props: {
    data: String,
    withoutDelete: {
      type: Boolean,
      default: false,
    },
    withKeys: {
      type: Boolean,
      default: false,
    },
    withoutControls: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style>
@screen dark {
  .vjs-tree.is-mouseover {
    background-color: theme('colors.gray.900');
  }

  .controls {
    top: 30px;
  }
}
</style>
