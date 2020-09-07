<template>
  <div id="app" class="h-screen grid grid-rows-layout grid-cols-12">
    <Header class="col-span-12 row-span-1 z-20"/>
    <KeysSidebar class="col-span-3 pt-2 px-1 overflow-auto max-h-screen"/>
    <KeyContent class="col-span-9 pb-2 px-4 overflow-hidden"/>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import { mapActions } from 'vuex'
import Header from '@/components/Header'
import KeyContent from '@/components/KeyList/KeyContent'
import KeysSidebar from '@/components/KeyList/KeysSidebar'

export default {
  components: { KeysSidebar, KeyContent, Header },
  mounted () {
    redis.connect()
    this.loadDatabases()
  },
  unmounted () {
    redis.disconnect()
  },
  methods: mapActions(['loadDatabases']),
}
</script>

<style>

</style>
