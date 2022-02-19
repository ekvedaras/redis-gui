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

const info = ref<Record<string, Record<string, string>>>({})
const tabs = ref<Record<string, PropTab>>({
  Server: {
    component: markRaw(TableInfo),
    props: {info: {}},
  },
  Clients: {
    component: markRaw(TableInfo),
    props: {info: {}},
  },
  Memory: {
    component: markRaw(TableInfo),
    props: {info: {}},
  },
  Persistence: {
    component: markRaw(TableInfo),
    props: {info: {}},
  },
  Stats: {
    component: markRaw(TableInfo),
    props: {info: {}},
  },
  Replication: {
    component: markRaw(TableInfo),
    props: {info: {}},
  },
  CPU: {
    component: markRaw(TableInfo),
    props: {info: {}},
  },
  Errorstats: {
    component: markRaw(TableInfo),
    props: {info: {}},
  },
  Cluster: {
    component: markRaw(TableInfo),
    props: {info: {}},
  },
  Keyspace: {
    component: markRaw(KeyspaceInfo),
    props: {info: {}},
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

    if (line.substring(0, 1) === '#') {
      scope = line.substring(2).trim()

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

<template>
  <AppModal
    title="Server info"
    class="overflow-y-hidden"
    full-height
    @close="emit('close')"
  >
    <template #header>
      <IconButton v-tooltip.bottom="'Refresh'" v-shortkey="['r']" @click="fetch" @shortkey="fetch">
        <RefreshIcon class="w-8" />
      </IconButton>
    </template>
    <Tabs :tabs="tabs" />
  </AppModal>
</template>
