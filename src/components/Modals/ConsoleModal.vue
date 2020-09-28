<template>
  <div class="bg-gray-200 p-4 flex flex-col space-y-4 text-sm">
    <h2 class="text-lg">Console</h2>
    <div class="rounded bg-white w-full font-mono shadow">
      <div class="overflow-y-auto p-4 " :style="{maxHeight: '70vh', scrollBehavior: 'smooth'}" ref="log">
        <div v-for="(line, i) in log" :key="i" :class="{'text-redis': line.isError, 'font-bold': line.isCommand}">
          <div v-if="typeof line.content === 'object'">
            <p v-for="(entry, j) in line.content" :key="j">
              {{ j }}) {{ entry }}
            </p>
          </div>
          <p v-else-if="line.isCommand">
            > {{ line.content }}
          </p>
          <p v-else>
            {{ line.content }}
          </p>
        </div>
        <span ref="bottom"></span>
      </div>
      <input
          type="text"
          ref="command"
          placeholder="Type redis command"
          v-model="command"
          @keydown.up.prevent="history(false)"
          @keydown.down="history(true)"
          @keydown.enter="send"
          class="border-t border-gray-200 bg-transparent py-2 px-4 w-full font-mono "/>
    </div>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import { database } from '@/services/database'
import { mapState } from 'vuex'

export default {
  name: 'ConsoleModal',
  data: () => ({
    log: [],
    historyIndex: -1,
    command: '',
  }),
  computed: mapState(['server']),
  methods: {
    history (previous) {
      if (previous) {
        this.historyIndex = Math.max(-1, this.historyIndex - 1)
      } else {
        this.historyIndex += 1
      }

      let cmd = database.get('history').get(this.server).get(this.historyIndex).value()

      if (cmd !== undefined) {
        this.command = cmd
      } else if (!previous) {
        this.historyIndex--
      }
    },
    send () {
      this.historyIndex = -1
      this.log.push({
        isError: false,
        isCommand: true,
        content: this.command,
      })

      let history = database.get('history').get(this.server).value()
      history.unshift(this.command)
      history = history.slice(0, 100)
      database.get('history').set(this.server, history).write()

      redis.silently().async(...this.command.split(' '))
          .then(result => {
            switch (typeof result) {
              case 'object':
                if (result === null) {
                  this.log.push({
                    isError: false,
                    isCommand: false,
                    content: `(nil)`,
                  })
                  return
                }

                this.log.push({
                  isError: false,
                  isCommand: false,
                  content: result,
                })
                return
              default:
                this.log.push({
                  isError: false,
                  isCommand: false,
                  content: result,
                })
            }
          })
          .then(() => this.command = '')
          .catch(e => {
            this.log.push({
              isError: true,
              content: e.toString(),
            })
          })
          .finally(() => this.$nextTick(() => this.$refs['log'].scrollTop = this.$refs['log'].scrollHeight))
    },
  },
}
</script>

<style scoped>

</style>
