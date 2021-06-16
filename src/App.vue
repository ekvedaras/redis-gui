<template>
  <div id="app" class="h-full">
    <Header class="h-12 z-20"/>
    <multipane layout="vertical" :style="{height: 'calc(100% - 55px)'}" @paneResizeStop="saveLayout">
      <KeysSidebar id="key-pane" ref="key-pane" class="pt-2 px-1 overflow-auto max-h-screen"/>
      <multipane-resizer class="transition transition-colors rounded hover:bg-gray-300 dark:hover:bg-gray-700"/>
      <KeyContent class="flex-1 pb-2 px-4 overflow-hidden rounded-b" />
    </multipane>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import { mapActions } from 'vuex'
import Header from '@/components/Elements/Header'
import KeyContent from '@/components/KeyList/KeyContent'
import KeysSidebar from '@/components/KeyList/KeysSidebar'
import { Multipane, MultipaneResizer } from 'vue-multipane'
import { database } from '@/services/database'

export default {
  components: { KeysSidebar, KeyContent, Header, Multipane, MultipaneResizer },
  mounted () {
    this.$refs['key-pane'].$el.style.width = database.get('settings.leftPaneSize').value() || '25%'
  },
  unmounted () {
    redis.disconnect()
  },
  methods: {
    ...mapActions('databases', ['load']),
    saveLayout (container, sizer, width) {
      database.set('settings.leftPaneSize', width).write()
    },
  },
}
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
