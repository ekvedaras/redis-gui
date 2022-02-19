<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRedis } from '/@/use/redis'
import { useToaster } from '/@/use/toaster'
import Value from '/@/components/Elements/Value.vue'
import CenteredLoader from '/@/components/Elements/CenteredLoader.vue'

const props = defineProps<{
  name: string,
}>()

const value = ref('')
const isLoading = ref(true)

const redis = useRedis()
const toaster = useToaster()

const save = async ({value: newValue}: { value: string }) => {
  try {
    await redis.client.set(props.name, newValue)
    value.value = newValue
    toaster.success('Saved')
  } catch (error) {
    toaster.error(error)
  }
}

onMounted(async () => {
  value.value = await redis.client.get(props.name)
  isLoading.value = false
})
</script>

<template>
  <div class="overflow-y-auto">
    <Value v-if="!isLoading" class="relative" :value="value" without-delete @save="save" />
    <CenteredLoader v-if="isLoading" />
  </div>
</template>
