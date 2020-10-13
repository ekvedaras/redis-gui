import { EventBus } from '@/services/eventBus'

export default {
  async mounted () {
    EventBus.$on('key-updated', async name => {
      if (name !== this.name) {
        return
      }

      await this.resetCursor()
      this.loadKeys()
    })
  },
  methods: {
    async resetCursor () {
    },
  },
}
