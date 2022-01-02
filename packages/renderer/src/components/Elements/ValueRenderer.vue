<template>
  <div class="relative group">
    <JsonRenderer v-if="showJson"
                  :data="value"
                  :without-delete="withoutDelete"
                  :with-keys="withKeys"
                  @edit="emit('edit')"
                  @delete="emit('delete')"
                  @copy="emit('copy')"
                  @toggleJson="toggleJson" />
    <PlainRenderer v-else
                   :data="value"
                   :without-delete="withoutDelete"
                   :with-keys="withKeys"
                   :with-json="isPotentialJson"
                   @edit="emit('edit')"
                   @delete="emit('delete')"
                   @copy="emit('copy')"
                   @toggleJson="toggleJson" />
  </div>
</template>

<script setup lang="ts">
import { useJson } from '/@/use/json'
import { computed, onBeforeMount, ref } from 'vue'
import { useToaster } from '/@/use/toaster'
import JsonRenderer from '/@/components/Elements/JsonRenderer.vue'
import PlainRenderer from '/@/components/Elements/PlainRenderer.vue'

const props = defineProps<{
  value: any
  withoutDelete: boolean
  withKeys: boolean
}>()

const emit = defineEmits<{
  (e: 'edit'): void,
  (e: 'delete'): void,
  (e: 'copy'): void,
}>()

const toaster = useToaster()
const {isJSON} = useJson()
const showJson = ref(false)

const isPotentialJson = computed(
  () => props.value.startsWith('[') || props.value.startsWith('{'),
)

const shouldAttemptJson = computed(
  () => props.value.length < 1024 * 10 && isPotentialJson.value,
)

const toggleJson = () => {
  if (showJson.value) {
    showJson.value = false
    return
  }

  if (!isPotentialJson.value || !isJSON(props.value)) {
    toaster.error('The value is not a valid JSON')
    return
  }

  showJson.value = true
}

onBeforeMount(() => {
  showJson.value = shouldAttemptJson.value && isJSON(props.value)
})
</script>

<style scoped>

</style>
