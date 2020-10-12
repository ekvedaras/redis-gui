<template>
  <div>
    <SearchBar v-model="search" :show-spinner="isLoading" with-add @add="showKeyAddModal"/>
    <div class="overflow-y-auto h-full pb-10 rounded overflow-x-hidden mt-4">
      <Value v-for="(item, i) in value"
             class="relative"
             :key="i" :value="item"
             @save="save(i, $event)"
             @delete="deleteItem(item)"/>
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

export default {
  name: 'SetContent',
  components: { LoadMoreButton, Value, SearchBar },
  mixins: [ScansKey],
  props: ['name'],
  data: () => ({
    value: [],
    scanUsing: 'sscan',
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
      this.value = merge ? { ...this.value, ...value } : value
    },
    showKeyAddModal () {
      this.$modal.show(AddKeyModal, { fill: { name: this.name, type: 'set' } })
    },
    save (key, { value }) {
      redis.async('srem', this.name, this.value[key]).then(
          () => redis.async('sadd', this.name, value)
              .then(() => this.$set(this.value, key, value))
              .then(() => this.$toasted.success('Saved'))
              .then(() => this.loadKeys()),
      )
    },
    deleteItem (value) {
      this.$modal.show('dialog', {
        title: 'Confirm',
        text: `Are you sure you want to delete <b>${value.substr(0, 50)}</b> item from ${this.name}?`,
        buttons: [
          {
            title: 'Cancel',
            handler: () => this.$modal.hide('dialog'),
          },
          {
            title: 'Confirm',
            handler: () => {
              this.$store.dispatch('keys/deleteSetItem', { keyName: this.name, value }).then(async () => {
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
