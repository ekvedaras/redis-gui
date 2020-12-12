<template>
  <div>
    <IconButton v-if="!withoutWordBreak" v-tooltip="'Toggle word break'" @click="$emit('toggleWordBreak')" class="absolute top-0 right-0 z-10" :class="[withoutDelete ? 'mr-12' : 'mr-18']">
      <WordBreakIcon class="w-4 m-1"/>
    </IconButton>
    <IconButton v-tooltip="'Copy'" @click="$emit('copy')" class="absolute top-0 right-0 z-10" :class="[withoutDelete ? 'mr-6' : 'mr-12']">
      <DocumentIcon class="w-4 m-1"/>
    </IconButton>
    <IconButton v-tooltip="'Edit'" @click="$emit('edit')" class="absolute top-0 right-0 z-10" :class="{'mr-6': !withoutDelete}">
      <EditIcon class="w-4 m-1"/>
    </IconButton>
    <IconButton v-tooltip="'Delete'" v-if="!withoutDelete" @click="$emit('delete')" class="absolute top-0 right-0 z-10">
      <DeleteIcon class="w-4 m-1"/>
    </IconButton>
  </div>
</template>

<script>
import IconButton from '@/components/Elements/IconButton'
import EditIcon from '@/components/Icons/EditIcon'
import DeleteIcon from '@/components/Icons/DeleteIcon'
import DocumentIcon from '@/components/Icons/DocumentIcon'
import WordBreakIcon from '@/components/Icons/WordBreakIcon'

export default {
  name: 'KeyItemControls',
  components: { WordBreakIcon, DocumentIcon, DeleteIcon, EditIcon, IconButton },
  props: {
    withoutDelete: {
      type: Boolean,
      default: false,
    },
    withoutWordBreak: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>

</style>
