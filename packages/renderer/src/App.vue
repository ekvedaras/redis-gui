<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useRedis } from '/@/use/redis'
import { useDatabase } from '/@/use/database'
import type { SplitpaneIndexedType } from 'splitpanes'
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import Header from '/@/components/Elements/Header.vue'
import KeysSidebar from '/@/components/Elements/KeysSidebar.vue'
import KeyContent from '/@/components/Elements/KeyContent.vue'
import { useServersStore } from '/@/store/servers'
import { useKeysStore } from '/@/store/keys'

const redis = useRedis()
const database = useDatabase()
const serversStore = useServersStore()
const keysStore = useKeysStore()

const saveLayout = (panes: SplitpaneIndexedType) => {
  database.data.settings.leftPaneSize = `${ panes[0].size }%`
  database.write()
}

onUnmounted(() => redis.disconnect())
</script>

<template>
  <Header class="h-12 z-20" />
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
      <KeysSidebar class="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200" />
    </Pane>
    <Pane class="flex-1 pb-2 px-4 overflow-hidden">
      <KeyContent
        v-show="serversStore.connected && !keysStore.loading"
        class="flex-1 pb-2 px-4 h-full overflow-hidden rounded-b bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
      />
    </Pane>
  </Splitpanes>
</template>

<style>
.splitpanes.default-theme .splitpanes__pane {
  @apply bg-gray-100 dark:bg-gray-900
}

.default-theme.splitpanes--vertical > .splitpanes__splitter,
.default-theme .splitpanes--vertical > .splitpanes__splitte {
  @apply border-0
}

.splitpanes.default-theme .splitpanes__splitter {
  @apply bg-gray-100 dark:bg-gray-900
}

.splitpanes.default-theme .splitpanes__splitter:after,
.splitpanes.default-theme .splitpanes__splitter:before {
  @apply bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700
}

.splitpanes.default-theme .splitpanes__splitter:hover:after,
.splitpanes.default-theme .splitpanes__splitter:hover:before {
  @apply bg-gray-300 dark:bg-gray-700
}
</style>
