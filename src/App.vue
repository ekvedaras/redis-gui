<template>
  <div id="app" class="h-full grid grid-rows-layout grid-cols-12">
    <Header class="col-span-12 row-span-1 z-20"/>
    <KeysSidebar class="col-span-3 pt-2 px-1 overflow-auto max-h-screen"/>
    <KeyContent class="col-span-9 pb-2 px-4 overflow-hidden rounded-b"/>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import { mapActions } from 'vuex'
import Header from '@/components/Elements/Header'
import KeyContent from '@/components/KeyList/KeyContent'
import KeysSidebar from '@/components/KeyList/KeysSidebar'

export default {
  components: { KeysSidebar, KeyContent, Header },
  unmounted () {
    redis.disconnect()
  },
  methods: {
    ...mapActions('databases', ['load']),
  },
}
</script>

<style>

</style>
