<template>
  <div>
    <SearchBar v-model="search" :show-spinner="isLoading" with-add @add="showKeyAddModal"/>
    <div class="overflow-y-auto h-full pb-10 rounded mt-4">
      <Value v-for="(item, key) in value"
             class="relative"
             :key="key" :value="item" :item-key="key"
             @save="save(key, $event)"
             @delete="deleteItem(key)"/>
      <LoadMoreButton @click="loadMore" v-if="nextCursor"/>
    </div>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import AddKeyModal from '@/components/Modals/AddKeyModal'
import { EventBus } from '@/services/eventBus'
import SearchBar from '@/components/Elements/SearchBar'
import Value from '@/components/Elements/Value'
import LoadMoreButton from '@/components/Elements/LoadMoreButton'
import ScansKey from '@/components/Mixins/ScansKey'
import _ from 'lodash'

export default {
  name: 'HashContent',
  components: { LoadMoreButton, Value, SearchBar },
  mixins: [ScansKey],
  props: ['name'],
  data: () => ({
    value: '',
    scanUsing: 'hscan',
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
  methods: {
    setScannedValue (value, merge) {
      let parsed = _.fromPairs(_.chunk(value, 2))
      this.value = merge ? { ...this.value, ...parsed } : parsed
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
