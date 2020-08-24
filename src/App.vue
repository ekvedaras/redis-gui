<template>
  <div id="app" class="h-screen grid grid-rows-layout grid-cols-12">
    <Header class="col-span-12 row-span-1 z-20"/>
    <Keys :keys="groupedKeys" class="col-span-3 pt-2 px-2 pb-10 overflow-auto max-h-screen"/>
    <KeyContent class="col-span-9 py-2 px-4"/>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import { mapActions, mapState } from 'vuex'
import Header from '@/components/Header'
import KeyContent from '@/components/KeyList/KeyContent'
import _ from 'lodash'

export default {
  components: { KeyContent, Header },
  mounted () {
    redis.connect()
    this.loadDatabases()
    this.loadKeys()
  },
  unmounted () {
    redis.disconnect()
  },
  methods: mapActions(['loadDatabases', 'loadKeys']),
  computed: {
    ...mapState(['keys']),
    groupedKeys () {
      let grouped = {}

      Object.entries(this.keys).forEach(([name, key]) => {
        if (name.indexOf(':') < 0) {
          grouped[name] = key
          return true
        }

        _.setWith(grouped, name.replace(/:/g, '.'), key, Object)
      })

      return grouped
    },
  },
}
</script>

<style>

</style>
