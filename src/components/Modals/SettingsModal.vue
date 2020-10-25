<template>
  <Modal title="Settings">
    <table>
      <tr>
        <th><label for="items-per-page" class="font-semibold mr-2">Items per page</label></th>
        <td><input type="number" step="1" min="1" id="items-per-page" v-model="itemsPerPage"/></td>
      </tr>
      <tr>
        <th><label for="namespace-separator" class="font-semibold mr-2">Namespace separator</label></th>
        <td><input type="text" min="1" id="namespace-separator" v-model="namespaceSeparator"/></td>
      </tr>
    </table>
    <div class="flex justify-end space-x-4">
      <PrimaryButton @click="save">Save</PrimaryButton>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modals/Modal'
import { database } from '@/services/database'
import PrimaryButton from '@/components/Elements/PrimaryButton'
import { redis } from '@/services/redis'
import { mapActions } from 'vuex'

export default {
  name: 'SettingsModal',
  components: { PrimaryButton, Modal },
  data: () => ({
    itemsPerPage: 0,
    namespaceSeparator: '-',
  }),
  mounted () {
    let settings = database.get('settings').value()
    this.itemsPerPage = settings.itemsPerPage
    this.namespaceSeparator = settings.namespaceSeparator
  },
  methods: {
    ...mapActions('keys', ['loadKeys']),
    save () {
      database.set('settings', {
        itemsPerPage: redis.pageSize = parseInt(this.itemsPerPage),
        namespaceSeparator: redis.namespaceSeparator = this.namespaceSeparator,
      }).write()

      this.$toasted.success('Saved')
      this.loadKeys()
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
table th {
  width: 33.3%;
  @apply text-right;
}

table th, table td {
  @apply p-1
}
</style>
