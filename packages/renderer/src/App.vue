<template>
  <div
    id="app"
    class="h-full flex items-center justify-center"
  >
    <div class="font-bold text-4xl">
      Hello World!
    </div>
  </div>
</template>

<script setup type="ts">
import { onUnmounted } from 'vue'
import { useRedis } from '/@/use/redis'

const redis = useRedis()

onUnmounted(() => redis.disconnect())
</script>

<style scoped>
#key-pane {
  min-width: 15%;
  max-width: 75%;
}

.multipane.layout-v .multipane-resizer {
  margin: 0;
  left: 0;
  min-width: 5px;
  width: 5px;
}
</style>
