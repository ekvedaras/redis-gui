<template>
  <div
    id="app"
    class="h-full"
  >
    <Header class="h-12 z-20" />
    <multipane
      layout="vertical"
      :style="{height: 'calc(100% - 55px)'}"
      @pane-resize-stop="saveLayout"
    >
      <KeysSidebar
        id="key-pane"
        ref="key-pane"
        class="pt-2 px-1 overflow-auto max-h-screen"
      />
      <multipane-resizer class="transition transition-colors rounded hover:bg-gray-300 dark:hover:bg-gray-700" />
      <KeyContent class="flex-1 pb-2 px-4 overflow-hidden rounded-b" />
    </multipane>
  </div>
</template>

<script setup type="ts">
import Header from '/@/components/Elements/Header'
import KeyContent from '/@/components/KeyList/KeyContent'
import KeysSidebar from '/@/components/KeyList/KeysSidebar'
import { Multipane, MultipaneResizer } from 'vue-multipane'
import { onMounted, onUnmounted, ref } from 'vue'
import { useDatabase } from '/@/use/database'
import { useRedis } from '/@/use/redis'

const keyPane = ref<KeysSidebar>(null)
const database = useDatabase()
const redis = useRedis()

const saveLayout = (container, sizer, width) => {
  database.data?.settings.leftPaneSize = width
  database.write()
}

onMounted(() => keyPane.value.$el.style.width = database.data?.settings.leftPaneSize ?? '25%')
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
