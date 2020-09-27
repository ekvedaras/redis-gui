<template>
  <div class="bg-gray-200 p-4 flex flex-col space-y-4">
    <h2 class="text-lg">Console</h2>
    <div class="rounded bg-black w-full text-white font-mono">
      <div class="overflow-y-auto p-4 " :style="{maxHeight: '70vh', scrollBehavior: 'smooth'}" ref="log">
        <p v-for="(line, i) in log" :key="i">{{ line }}</p>
        <span ref="bottom"></span>
      </div>
      <input type="text" ref="command" placeholder="Type redis command" v-model="command" @keydown.enter="send" class="border-t border-gray-800 bg-transparent py-2 px-4 w-full text-white font-mono"/>
    </div>
  </div>
</template>

<script>
import { redis } from '@/services/redis'

export default {
  name: 'ConsoleModal',
  data: () => ({
    log: [],
    command: '',
  }),
  methods: {
    send() {
      redis.async(...this.command.split(' '))
      .then(result => {
        // todo match redis cli output
        this.log.push(result)
        this.command = '';
      }).catch(e => {
        console.log('e:' + e)
      })
          .finally(() => this.$nextTick(() => this.$refs['log'].scrollTop = this.$refs['log'].scrollHeight))
    }
  }
}
</script>

<style scoped>

</style>
