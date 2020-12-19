<template>
  <Modal title="Server info" class="overflow-y-hidden h-screen">
    <IconButton @click="fetch" class="absolute right-0 mr-3 mt-3 top-0">
      <RefreshIcon class="w-8"/>
    </IconButton>
    <Tabs :tabs="tabs"/>
  </Modal>
</template>

<script>
import Modal from '@/components/Modals/Modal'
import Tabs from '@/components/Elements/Tabs'
import KeyspaceInfo from '@/components/Modals/Info/KeyspaceInfo'
import { redis } from '@/services/redis'
import TableInfo from '@/components/Modals/Info/TableInfo'
import IconButton from '@/components/Elements/IconButton'
import RefreshIcon from '@/components/Icons/RefreshIcon'

export default {
  name: 'InfoModal',
  components: { RefreshIcon, IconButton, Tabs, Modal },
  data () {
    return {
      info: {},
      tabs: {
        Server: {
          component: TableInfo,
          props: { info: {} },
        },
        Clients: {
          component: TableInfo,
          props: { info: {} },
        },
        Memory: {
          component: TableInfo,
          props: { info: {} },
        },
        Persistence: {
          component: TableInfo,
          props: { info: {} },
        },
        Stats: {
          component: TableInfo,
          props: { info: {} },
        },
        Replication: {
          component: TableInfo,
          props: { info: {} },
        },
        CPU: {
          component: TableInfo,
          props: { info: {} },
        },
        Cluster: {
          component: TableInfo,
          props: { info: {} },
        },
        Keyspace: {
          component: KeyspaceInfo,
          props: { info: {} },
        },
      },
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch() {
      redis.async('info').then(result => {
        let scope = '', key, value

        result.split('\n').forEach(line => {
          if (!line.trim().length) {
            return true
          }

          if (line.substr(0, 1) === '#') {
            scope = line.substr(2).trim()
            this.$set(this.info, scope, {})
            return true
          }

          [key, value] = line.split(':')
          this.$set(this.info[scope], key, value)
          this.$set(this.tabs[scope].props.info, key, value)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
