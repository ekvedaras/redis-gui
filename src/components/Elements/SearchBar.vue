<template>
  <div class="flex justify-center items-center space-x-2">
    <Search :value="value" @input="$emit('input', $event)" :show-spinner="showSpinner"/>
    <IconButton v-if="withAdd" @click="showKeyAddModal">
      <AddIcon class="w-10"/>
    </IconButton>
  </div>
</template>

<script>
import Search from '@/components/Elements/Search'
import AddIcon from '@/components/Icons/AddIcon'
import IconButton from '@/components/Elements/IconButton'
import AddKeyModal from '@/components/Modals/AddKeyModal'

export default {
  name: 'SearchBar',
  components: { IconButton, AddIcon, Search },
  props: {
    value: {
      required: true,
    },
    showSpinner: {
      type: Boolean,
      default: false,
    },
    withAdd: {
      type: Boolean,
      default: false,
    },
    addName: {
      type: String,
      required: false,
    },
    addType: {
      type: String,
      required: false,
    },
  },
  methods: {
    showKeyAddModal () {
      this.$modal.show(AddKeyModal, { fill: { name: this.addName, type: this.addType } })
    },
  },
}
</script>

<style scoped>

</style>
