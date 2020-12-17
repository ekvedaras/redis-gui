<template>
  <div v-if="matchedCommand" class="command-info absolute rounded-t w-full py-4 px-4 bottom-0 text-gray-900 dark:text-gray-400">
    <span @click="openDocs" v-tooltip="`${upperName} documentation`" :style="{cursor: 'help'}">
      <b>{{ upperName }}</b>
    </span>
    <span class="ml-2">{{ commandInfo.args }}</span>
    <div class="text-sm mt-2">{{ commandInfo.summary }}</div>
  </div>
</template>

<script>
import { commands } from '@/definitions/redisCommands'
import IFrameModal from '@/components/Modals/IFrameModal'

export default {
  name: 'CommandInfo',
  props: ['command'],
  computed: {
    documentation () {
      return `https://redis.io/commands/${this.matchedCommand.toLowerCase().replace(/ /g, '-')}`
    },
    upperName () {
      return this.matchedCommand.toUpperCase()
    },
    commandInfo () {
      if (!this.matchedCommand) {
        return false
      }

      return commands[this.matchedCommand]
    },
    matchedCommand () {
      const [firstKeyword, secondKeyword] = this.command.toLowerCase().trim().split(' ')

      if (Object.prototype.hasOwnProperty.call(commands, firstKeyword)) {
        return firstKeyword
      }

      if (Object.prototype.hasOwnProperty.call(commands, `${firstKeyword} ${secondKeyword}`)) {
        return `${firstKeyword} ${secondKeyword}`
      }

      return false
    },
  },
  methods: {
    openDocs () {
      this.$modal.show(IFrameModal, {
        title: `${this.upperName} documentation`,
        url: this.documentation,
      })
    },
  },
}
</script>

<style scoped>
div.command-info {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, .7)
}

@screen dark {
  div.command-info {
    background: rgba(0, 0, 0, .4)
  }
}
</style>
