<template>
  <div class="relative">
    <IconButton @click="$emit('edit')" class="absolute top-0 right-0 z-10" :class="{'mr-6': !withoutDelete}">
      <EditIcon class="w-4 m-1"/>
    </IconButton>
    <IconButton v-if="!withoutDelete" @click="$emit('delete')" class="absolute top-0 right-0 z-10">
      <DeleteIcon class="w-4 m-1"/>
    </IconButton>
  </div>
</template>

<script>
import IconButton from '@/components/Elements/IconButton'
import EditIcon from '@/components/Icons/EditIcon'
import DeleteIcon from '@/components/Icons/DeleteIcon'

export default {
  name: 'KeyItemControls',
  components: { DeleteIcon, EditIcon, IconButton },
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
