<template>
  <div class="p-4">
    <SearchBar v-model="search" :show-spinner="isLoading" with-add @add="showKeyAddModal"/>
    <div class="overflow-y-auto h-full pb-10 rounded overflow-x-hidden mt-2">
      <div v-for="(item, i) in value" :key="i">
        <div class="relative" v-if="!isEditing[i]">
          <Button @click="editItem(item, i)" class="absolute top-0 right-0 mt-2 mr-8 z-10">
            <EditIcon class="w-4 m-1"/>
          </Button>
          <Button @click="deleteItem(item, i)" class="absolute top-0 right-0 mt-2 mr-2 z-10">
            <DeleteIcon class="w-4 m-1"/>
          </Button>
          <ValueRenderer :value="item" class="mb-4"/>
        </div>
        <div v-if="isEditing[i]">
          <textarea class="p-2 w-full shadow h-64" :ref="`editor_${i}`" v-model="editValue" @keydown.esc="close(i)" @keydown.ctrl.enter="save(i)"/>
          <span class="text-xs text-gray-500">CTRL + Enter to save, Esc to cancel</span>
        </div>
      </div>
      <button @click="loadMore" v-if="nextCursor" class="underline rounded transition duration-200 ease-in-out hover:bg-white hover:shadow hover:no-underline m-2 p-1">Load more...</button>
    </div>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import ValueRenderer from '@/components/Renderer/ValueRenderer'
import AddKeyModal from '@/components/Modals/AddKeyModal'
import { EventBus } from '@/services/eventBus'
import DeleteIcon from '@/components/Icons/DeleteIcon'
import EditIcon from '@/components/Icons/EditIcon'
import Button from '@/components/Elements/Button'
import SearchBar from '@/components/Elements/SearchBar'

export default {
  name: 'SetContent',
  components: { SearchBar, Button, EditIcon, DeleteIcon, ValueRenderer },
  props: ['name'],
  data: () => ({
    value: [],
    search: '',
    isLoading: true,
    isEditing: {},
    nextCursor: 0,
    editValue: '',
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
      return redis.async('sscan', this.name, cursor, 'MATCH', pattern, 'COUNT', limit).then(result => {
        result.lastLoad = Object.keys(result[1]).length

        this.nextCursor = parseInt(result[0])

        this.value = cursor ? { ...this.value, ...result[1] } : result[1]

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
      this.$modal.show(AddKeyModal, { fill: { name: this.name, type: 'set' } })
    },
    editItem (value, index) {
      this.editValue = value
      this.$set(this.isEditing, index, true)
      this.$nextTick(() => this.$refs[`editor_${index}`][0].focus())
    },
    save (index) {
      redis.async('srem', this.name, this.value[index])
          .then(() => redis.async('sadd', this.name, this.editValue)
              .then(() => this.value[index] = this.editValue)
              .then(() => this.$toasted.success('Saved'))
              .then(() => this.loadKeys()))
          .finally(() => this.close(index))
    },
    close (index) {
      this.$set(this.isEditing, index, false)
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
