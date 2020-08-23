<template>
  <div id="app">
    <Navigation/>
    <div class="text-center">
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation'
import { redis } from '@/services/redis'
import { mapActions } from 'vuex'

export default {
  components: { Navigation },
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
