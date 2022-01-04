<template>
  <div class="overflow-y-auto">
    <Value class="relative" v-if="!isLoading" :value="value" @save="save" without-delete />
    <CenteredLoader v-if="isLoading" />
  </div>
</template>

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

const save = async (newValue: string) => {
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

<style scoped>

</style>
