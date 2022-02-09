<template>
  <div class="overflow-y-auto">
    <Value v-if="!isLoading" class="relative" :value="value" without-delete @save="save" />
    <CenteredLoader v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRedis } from '/@/use/redis'
import { useToaster } from '/@/use/toaster'

const redis = useRedis()
const toaster = useToaster()

const props = defineProps<{
  name: string,
}>()

const value = ref('')
const isLoading = ref(true)

onMounted(async () => {
  value.value = await redis.client.get(props.name)
  isLoading.value = false
})

const save = async ({value: val}: { value: string }) => {
  await redis.client.set(props.name, val)
  value.value = val
  toaster.success('Saved')
}
</script>

<style scoped>

</style>
