<template>
  <div class="h-12 z-20">
    Header
  </div>
  <Splitpanes
    class="default-theme"
    style="height: calc(100% - 3em)"
    @resize="saveLayout"
  >
    <Pane
      id="key-pane"
      ref="keyPane"
      min-size="15"
      max-size="50"
      :size="database.data.settings.leftPaneSize"
      class="pt-2 px-1 overflow-auto max-h-screen"
    >
      Keys
    </Pane>
    <Pane class="flex-1 pb-2 px-4 overflow-hidden rounded-b">
      Content
    </Pane>
  </Splitpanes>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useRedis } from '/@/use/redis'
import { useDatabase } from '/@/use/database'
import type { SplitpaneIndexedType} from 'splitpanes';
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const redis = useRedis()
const database = useDatabase()

const saveLayout = (panes: SplitpaneIndexedType) => {
  database.data.settings.leftPaneSize = `${ panes[0].size }%`
  database.write()
}

onUnmounted(() => redis.disconnect())
</script>

<style scoped>

</style>
