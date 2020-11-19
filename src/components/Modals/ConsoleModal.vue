<template>
  <Modal title="Console">
    <div class="rounded bg-white dark:bg-black w-full font-mono shadow">
      <div class="relative">
        <div class="overflow-y-auto p-4 relative" :style="{maxHeight: '70vh', scrollBehavior: 'smooth'}" ref="log">
          <ConsoleLogLine v-for="(line, i) in log" :key="i" :log="line"/>
        </div>
        <div v-if="structure" class="absolute z-50 rounded-t shadow w-full py-4 px-4 bottom-0 text-gray-700 dark:text-gray-500" id="structure" v-html="structure"/>
      </div>
      <input
          type="text"
          ref="command"
          placeholder="Type redis command"
          v-model="command"
          @keydown.up.prevent="history(false)"
          @keydown.down="history(true)"
          @keydown.enter="send"
          class="border-t border-gray-200 bg-transparent py-2 px-4 w-full font-mono shadow-none rounded-t-none"/>
    </div>
  </Modal>
</template>

<script>
import { redis } from '@/services/redis'
import { database } from '@/services/database'
import { mapState } from 'vuex'
import Modal from '@/components/Modals/Modal'
import { SentCommand } from '@/models/SentCommand'
import { ConsoleLog } from '@/models/ConsoleLog'
import { ErrorResponse } from '@/models/ErrorResponse'
import ConsoleLogLine from '@/components/Elements/ConsoleLogLine'
import { commands } from '@/definitions/redisCommands'

export default {
  name: 'ConsoleModal',
  components: { ConsoleLogLine, Modal },
  data: () => ({
    log: [],
    historyIndex: -1,
    command: '',
  }),
  computed: {
    ...mapState('servers', ['selected']),
    structure () {
      let command = this.command.split(' ')[0].toLowerCase().trim()

      if (!Object.prototype.hasOwnProperty.call(commands, command)) {
        return false
      }

      return `<a href="https://redis.io/commands/${command.toLowerCase().trim().replace(/\w/g, '-')}" target="_blank">
    <b>${command.toUpperCase()}</b></a>
    <span>${commands[command].args}</span>
    <div>${commands[command].summary}</div>`
    },
  },
  methods: {
    history (previous) {
      if (previous) {
        this.historyIndex = Math.max(-1, this.historyIndex - 1)
      } else {
        this.historyIndex += 1
      }

      let cmd = database.get('history').get(this.selected).get(this.historyIndex).value()

      if (cmd !== undefined) {
        this.command = cmd
      } else if (!previous) {
        this.historyIndex--
      }
    },
    send () {
      this.historyIndex = -1
      this.log.push(new SentCommand(this.command))

      let history = database.get('history').get(this.selected).value()
      history.unshift(this.command)
      history = history.slice(0, 100)
      database.get('history').set(this.selected, history).write()

      redis.silently().async(...this.command.split(' '))
          .then(result => {
            if (result === null) {
              return this.log.push(new ConsoleLog('(nil)'))
            }

            this.log.push(new ConsoleLog(result))
          })
          .then(() => this.command = '')
          .catch(e => this.log.push(new ErrorResponse(e)))
          .finally(() => this.$nextTick(() => this.$refs['log'].scrollTop = this.$refs['log'].scrollHeight))
    },
  },
}
</script>

<style scoped>
#structure {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, .5)
}

@screen dark {
  #structure {
    background: rgba(0, 0, 0, .2)
  }
}
</style>
