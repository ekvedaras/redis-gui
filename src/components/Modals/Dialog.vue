<template>
  <Modal :title="title">
    <p v-html="text"/>
    <div class="flex justify-end space-x-4">
      <Button @click="hide">Cancel</Button>
      <PrimaryButton @click="handler">{{ action }}</PrimaryButton>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modals/Modal'
import PrimaryButton from '@/components/Elements/PrimaryButton'
import Button from '@/components/Elements/Button'

export default {
  name: 'Dialog',
  components: { Button, PrimaryButton, Modal },
  props: {
    title: {
      type: String,
      default: 'Confirm',
    },
    text: {
      type: String,
    },
    action: {
      type: String,
      default: 'Confirm',
    },
    handler: {
      type: Function,
    },
  },
  methods: {
    hide () {
      this.$modal.hide('dialog')
    },
  },
}
</script>

<style scoped>

</style>
