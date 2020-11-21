<template>
  <div id="app" class="h-screen grid grid-rows-layout grid-cols-12">
    <Header class="col-span-12 row-span-1 z-20"/>
    <KeysSidebar class="col-span-3 pt-2 px-1 overflow-auto max-h-screen"/>
    <KeyContent class="col-span-9 pb-2 px-4 overflow-hidden rounded-b"/>
    <div class="col-span-12 flex space-x-2 p-2 justify-end">
      <IconButton @click="openTwitter">
        <TwitterIcon v-tooltip="'Follow <b>@ekvedaras</b> on twitter'"/>
      </IconButton>
      <IconButton @click="openGitHub">
        <GitHubIcon v-tooltip="'Star <b>redis-gui</b> on GitHub'"/>
      </IconButton>
    </div>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import { mapActions } from 'vuex'
import Header from '@/components/Elements/Header'
import KeyContent from '@/components/KeyList/KeyContent'
import KeysSidebar from '@/components/KeyList/KeysSidebar'
import TwitterIcon from '@/components/Icons/TwitterIcon'
import GitHubIcon from '@/components/Icons/GitHubIcon'
import IconButton from '@/components/Elements/IconButton'

export default {
  components: { IconButton, GitHubIcon, TwitterIcon, KeysSidebar, KeyContent, Header },
  unmounted () {
    redis.disconnect()
  },
  methods: {
    ...mapActions('databases', ['load']),
    openTwitter () {
      window.open('https://twitter.com/ekvedaras', '_blank')
    },
    openGitHub () {
      window.open('https://github.com/ekvedaras/redis-gui', '_blank')
    }
  },
}
</script>

<style>

</style>
