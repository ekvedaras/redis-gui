<template>
  <div class="p-4 pb-10">
    <div class="flex justify-center space-x-2 mb-2">
      <Search v-model="search" :show-spinner="isLoading"/>
      <Button @click="showKeyAddModal">
        <AddIcon class="w-10"/>
      </Button>
    </div>
    <div class="overflow-y-auto h-full pb-10 rounded overflow-x-hidden">
      <div v-for="(item, i) in filtered" :key="i">
        <div class="relative" v-if="!isEditing[i]">
          <Button @click="editItem(item, i)" class="absolute top-0 right-0 mt-2 mr-8">
            <EditIcon class="w-5"/>
          </Button>
          <Button @click="deleteItem(item, i)" class="absolute top-0 right-0 mt-2 mr-2">
            <DeleteIcon class="w-5"/>
          </Button>
          <ValueRenderer :value="item" class="mb-4"/>
        </div>
        <div v-if="isEditing[i]">
          <textarea class="p-2 w-full shadow h-64" :ref="`editor_${i}`" v-model="editValue" @keydown.esc="close(i)" @keydown.ctrl.enter="save(i)"/>
          <span class="text-xs text-gray-500">CTRL + Enter to save, Esc to cancel</span>
        </div>
      </div>
      <button @click="loadMore" v-if="start" class="underline rounded transition duration-200 ease-in-out hover:bg-white hover:shadow hover:no-underline m-2 p-1">Load more...</button>
    </div>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import ValueRenderer from '@/components/Renderer/ValueRenderer'
import AddIcon from '@/components/Icons/AddIcon'
import AddKeyModal from '@/components/Modals/AddKeyModal'
import DeleteIcon from '@/components/Icons/DeleteIcon'
import { EventBus } from '@/services/eventBus'
import EditIcon from '@/components/Icons/EditIcon'
import Search from '@/components/Elements/Search'
import Button from '@/components/Elements/Button'

export default {
  name: 'ListContent',
  components: { Button, Search, EditIcon, DeleteIcon, AddIcon, ValueRenderer },
  props: ['name'],
  data: () => ({
    value: [],
    size: 0,
    start: 0,
    isLoading: true,
    isEditing: {},
    search: '',
    editValue: '',
  }),
  computed: {
    filtered () {
      if (!this.search.length) {
        return this.value
      }

      let pattern = new RegExp(this.search, 'i')
      return this.value.filter(item => pattern.test(item))
    },
  },
  async mounted () {
    this.size = await redis.async('llen', this.name)
    this.loadKeys()
    EventBus.$on('key-updated', async name => {
      if (name !== this.name) {
        return
      }

      this.size = await redis.async('llen', this.name)
      this.start = 0
      this.loadKeys()
    })
  },
  methods: {
    loadKeys ({ start = 0, limit = Math.min(this.size - this.start, redis.pageSize) } = {}) {
      this.isLoading = true
      return redis.async('lrange', this.name, start, start + limit - 1).then(result => {
        if (start + result.length < this.size) {
          this.start = start + result.length
        } else {
          this.start = 0
        }

        if (start) {
          result.forEach(item => this.value.push(item))
        } else {
          this.value = result
        }
      }).finally(() => this.isLoading = false)
    },
    loadMore () {
      this.loadKeys({ start: this.start })
    },
    showKeyAddModal () {
      this.$modal.show(AddKeyModal, { fill: { name: this.name, type: 'list' } })
    },
    editItem (value, index) {
      this.editValue = value
      this.$set(this.isEditing, index, true)
      this.$nextTick(() => this.$refs[`editor_${index}`][0].focus())
    },
    save (index) {
      redis.async('lset', this.name, index, this.editValue)
          .then(() => this.value[index] = this.editValue)
          .then(() => this.$toasted.success('Saved'))
          .finally(() => this.close(index))
    },
    close (index) {
      this.$set(this.isEditing, index, false)
    },
    deleteItem (value, index) {
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
              this.$store.dispatch('keys/deleteListItem', { keyName: this.name, index }).then(async () => {
                this.size = await redis.async('llen', this.name)
                this.start = 0
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
