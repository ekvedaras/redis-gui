<template>
  <div class="relative group">
    <JsonRenderer v-if="showJson"
                  :data="value"
                  :without-delete="withoutDelete"
                  :with-keys="withKeys"
                  @edit="$emit('edit')"
                  @delete="$emit('delete')"
                  @copy="$emit('copy')"
                  @toggleJson="toggleJson"/>
    <PlainRenderer v-else
                   :data="value"
                   :without-delete="withoutDelete"
                   :with-keys="withKeys"
                   :with-json="isPotentialJson"
                   @edit="$emit('edit')"
                   @delete="$emit('delete')"
                   @copy="$emit('copy')"
                   @toggleJson="toggleJson"/>
  </div>
</template>

<script>
import { isJSON } from '@/services/json'
import JsonRenderer from '@/components/Renderer/JsonRenderer'
import PlainRenderer from '@/components/Renderer/PlainRenderer'

export default {
  name: 'ValueRenderer',
  components: { PlainRenderer, JsonRenderer },
  props: ['value', 'withoutDelete', 'withKeys'],
  methods: {
    isJSON,
    toggleJson () {
      if (this.showJson) {
        this.showJson = false
        return
      }

      if (!this.isPotentialJson || !this.isJSON(this.value)) {
        this.$toasted.error('The value is not a valid JSON')
        return
      }

      this.showJson = true
    },
  },
  data: () => ({
    showJson: false,
  }),
  beforeMount () {
    this.showJson = this.shouldAttemptJson && this.isJSON(this.value)
  },
  computed: {
    isPotentialJson() {
      return this.value.startsWith('[') || this.value.startsWith('{')
    },
    shouldAttemptJson () {
      return this.value.length < 1024 * 10 && this.isPotentialJson
    },
  },
}
</script>

<style scoped>

</style>
