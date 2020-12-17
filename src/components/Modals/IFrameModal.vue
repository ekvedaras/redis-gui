<template>
  <Modal :title="title">
    <iframe :src="url" :style="{height: '80vh'}" class="shadow rounded" ref="iframe"/>
  </Modal>
</template>

<script>
import Modal from '@/components/Modals/Modal'

export default {
  name: 'IFrameModal',
  components: { Modal },
  props: ['url', 'title'],
  mounted () {
    // Otherwise ESC wont close the modal while iframe is focused. Helps for quick close after miss-click
    setTimeout(() => this.$refs.iframe.blur(), 500)
  }
}
</script>

<style scoped>

</style>
