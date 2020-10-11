<template>
  <div class="p-4 pb-10">
    <SearchBar v-model="search" :show-spinner="isLoading" with-add @add="showKeyAddModal"/>
    <div class="overflow-y-auto h-full pb-10 rounded mt-2">
      <Value v-for="(item, key) in value"
             class="relative"
             :key="key" :value="item" :item-key="key"
             @save="save(key, $event)"
             @delete="deleteItem(key)"/>
      <button @click="loadMore" v-if="nextCursor" class="underline rounded transition duration-200 ease-in-out hover:bg-white hover:shadow hover:no-underline m-2 p-1">Load more...</button>
    </div>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import _ from 'lodash'
import AddKeyModal from '@/components/Modals/AddKeyModal'
import { EventBus } from '@/services/eventBus'
import SearchBar from '@/components/Elements/SearchBar'
import Value from '@/components/Elements/Value'

export default {
  name: 'HashContent',
  components: { Value, SearchBar },
  props: ['name'],
  data: () => ({
    value: '',
    search: '',
    isLoading: true,
    nextCursor: 0,
  }),
  async mounted () {
    await this.loadKeys()
    EventBus.$on('key-updated', async name => {
      if (name !== this.name) {
        return
      }

      this.loadKeys()
    })
  },
  watch: {
    search () {
      let wildcard = this.search.indexOf('*') > -1 ? '' : '*'
      this.loadKeys({ pattern: `${wildcard}${this.search}${wildcard}` })
    },
  },
  methods: {
    loadKeys ({ pattern = '*', cursor = 0, limit = redis.pageSize, lastLoad = 0 } = {}) {
      this.isLoading = true
      return redis.async('hscan', this.name, cursor, 'MATCH', pattern, 'COUNT', limit).then(result => {
        result.lastLoad = Object.keys(result[1]).length
        this.nextCursor = parseInt(result[0])

        let value = _.fromPairs(_.chunk(result[1], 2))
        this.value = cursor ? { ...this.value, ...value } : value

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
    showKeyAddModal () {
      this.$modal.show(AddKeyModal, { fill: { name: this.name, type: 'hash' } })
    },
    save (key, { key: newKey, value }) {
      (key === newKey ? Promise.resolve() : redis.async('hdel', this.name, key))
          .then(() => redis.async('hset', this.name, newKey, value)
              .then(() => this.$toasted.success('Saved'))
              .then(() => this.loadKeys()))
    },
    deleteItem (key) {
      this.$modal.show('dialog', {
        title: 'Confirm',
        text: `Are you sure you want to delete <b>${key}</b> item from ${this.name}?`,
        buttons: [
          {
            title: 'Cancel',
            handler: () => this.$modal.hide('dialog'),
          },
          {
            title: 'Confirm',
            handler: () => {
              this.$store.dispatch('keys/deleteHashItem', { keyName: this.name, key }).then(async () => {
                this.loadKeys()
              })
              this.$modal.hide('dialog')
            },
          },
        ],
      })
    },
  },
}
</script>

<style scoped>

</style>
