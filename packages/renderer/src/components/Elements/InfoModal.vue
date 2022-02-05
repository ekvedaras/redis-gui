<template>
  <AppModal
    title="Server info"
    class="overflow-y-hidden"
    full-height
    @close="emit('close')"
  >
    <IconButton
      v-tooltip="'Refresh'"
      class="absolute right-0 mr-3 mt-3 top-0"
      @click="fetch"
    >
      <RefreshIcon class="w-8" />
    </IconButton>
    <Tabs :tabs="tabs" />
  </AppModal>
</template>

<script setup lang="ts">
import IconButton from '/@/components/Elements/IconButton.vue'
import RefreshIcon from '/@/components/Icons/RefreshIcon.vue'
import type { PropTab } from '/@/components/Elements/Tabs.vue'
import Tabs from '/@/components/Elements/Tabs.vue'
import TableInfo from '/@/components/Elements/TableInfo.vue'
import KeyspaceInfo from '/@/components/Elements/KeyspaceInfo.vue'
import AppModal from '/@/components/Elements/AppModal.vue'
import { markRaw, onBeforeMount, ref } from 'vue'
import { useRedis } from '/@/use/redis'

const emit = defineEmits<{
  (e: 'close'): void;
}>()

const tableInfo = markRaw(TableInfo)
const keySpaceInfo = markRaw(KeyspaceInfo)

const info = ref<Record<string, Record<string, string>>>({})
const tabs = ref<Record<string, PropTab>>({
  Server: {
    component: tableInfo,
    props: { info: {} },
  },
  Clients: {
    component: tableInfo,
    props: { info: {} },
  },
  Memory: {
    component: tableInfo,
    props: { info: {} },
  },
  Persistence: {
    component: tableInfo,
    props: { info: {} },
  },
  Stats: {
    component: tableInfo,
    props: { info: {} },
  },
  Replication: {
    component: tableInfo,
    props: { info: {} },
  },
  CPU: {
    component: tableInfo,
    props: { info: {} },
  },
  Errorstats: {
    component: tableInfo,
    props: { info: {} },
  },
  Cluster: {
    component: tableInfo,
    props: { info: {} },
  },
  Keyspace: {
    component: keySpaceInfo,
    props: { info: {} },
  },
})

const redis = useRedis()
const fetch = async () => {
  const result = await redis.client.info()

  let scope = '', key, value

  result.split('\n').forEach((line: string) => {
    if (!line.trim().length) {
      return true
    }

    if (line.substr(0, 1) === '#') {
      scope = line.substr(2).trim()

      info.value[scope] = {}
      return true
    }

    [key, value] = line.split(':')

    info.value[scope][key] = value
    tabs.value[scope].props.info[key] = value
  })
}

onBeforeMount(fetch)
</script>

<style scoped>

</style>
