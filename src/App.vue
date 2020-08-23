<template>
  <div id="app" class="h-screen grid grid-rows-layout grid-cols-12">
    <Header class="col-span-12 row-span-1"/>
    <Keys class="col-span-3"/>
    <KeyContent class="col-span-9"/>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import { mapActions } from 'vuex'
import Header from '@/components/Header'
import Keys from '@/components/Keys'
import KeyContent from '@/components/KeyContent'

export default {
  components: { KeyContent, Keys, Header },
  mounted () {
    redis.connect()
    this.loadDatabases()
    this.loadKeys()
  },
  unmounted () {
    redis.disconnect()
  },
  methods: mapActions(['loadDatabases', 'loadKeys']),
}
</script>

<style>

</style>
