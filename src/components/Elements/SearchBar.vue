<template>
  <div class="flex justify-center items-center space-x-2">
    <Search :value="value" @input="$emit('input', $event)" :show-spinner="showSpinner"/>
    <Button v-if="withAdd" @click="$emit('add')">
      <AddIcon class="w-10"/>
    </Button>
  </div>
</template>

<script>
import Search from '@/components/Elements/Search'
import AddIcon from '@/components/Icons/AddIcon'
import Button from '@/components/Elements/Button'

export default {
  name: 'SearchBar',
  components: { Button, AddIcon, Search },
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
  },
}
</script>

<style scoped>

</style>
