<template>
  <Modal title="Console">
    <div class="rounded bg-white dark:bg-black w-full font-mono shadow">
      <div class="overflow-y-auto p-4 " :style="{maxHeight: '70vh', scrollBehavior: 'smooth'}" ref="log">
        <ConsoleLogLine v-for="(line, i) in log" :key="i" :log="line"/>
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

export default {
  name: 'ConsoleModal',
  components: { ConsoleLogLine, Modal },
  data: () => ({
    log: [],
    historyIndex: -1,
    command: '',
  }),
  computed: mapState('servers', ['selected']),
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

</style>
