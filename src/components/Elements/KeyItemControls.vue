<template>
  <div class="relative">
    <Button @click="$emit('edit')" class="absolute top-0 right-0 z-10" :class="{'mr-6': !withoutDelete}">
      <EditIcon class="w-4 m-1"/>
    </Button>
    <Button v-if="!withoutDelete" @click="$emit('delete')" class="absolute top-0 right-0 z-10">
      <DeleteIcon class="w-4 m-1"/>
    </Button>
  </div>
</template>

<script>
import Button from '@/components/Elements/Button'
import EditIcon from '@/components/Icons/EditIcon'
import DeleteIcon from '@/components/Icons/DeleteIcon'

export default {
  name: 'KeyItemControls',
  components: { DeleteIcon, EditIcon, Button },
  props: {
    withoutDelete: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>

</style>
