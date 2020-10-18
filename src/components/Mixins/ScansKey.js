import { redis } from '@/services/redis'
import { mapActions } from 'vuex'

export default {
  data: () => ({
    search: '',
    isLoading: true,
    nextCursor: 0,
    scanUsing: 'scan',
  }),
  watch: {
    search () {
      let wildcard = this.search.indexOf('*') > -1 ? '' : '*'
      this.loadKeys({ pattern: `${wildcard}${this.search}${wildcard}` })
    },
  },
  async mounted () {
    await this.loadKeys()
  },
  methods: {
    ...mapActions('keys', ['loadKeyInfo']),
    async loadKeys ({ pattern = '*', cursor = 0, limit = redis.pageSize, lastLoad = 0 } = {}) {
      this.isLoading = true
      await this.loadKeyInfo({name: this.name})
      return redis.async(this.scanUsing, this.name, cursor, 'MATCH', pattern, 'COUNT', limit).then(result => {
        result.lastLoad = Object.keys(result[1]).length
        this.nextCursor = parseInt(result[0])

        this.setScannedValue(result[1], cursor)

        return result
      }).then(result => {
        if (result.nextCursor && lastLoad + result.lastLoad < limit) {
          return this.loadKeys({ pattern, cursor: result.nextCursor, limit, lastLoad: lastLoad + Object.keys(result[1]).length })
        }

        return result
      }).finally(() => this.isLoading = false)
    },
    loadMore () {
      this.loadKeys({ pattern: `*${this.search}*`, cursor: this.nextCursor })
    },
  },
}
