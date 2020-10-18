<template>
  <IconButton @click="$emit('click')"
              class="underline rounded transition duration-200 ease-in-out hover:bg-white hover:shadow hover:no-underline m-2 p-1">
    Load more...
  </IconButton>
</template>

<script>
import IconButton from '@/components/Elements/IconButton'

export default {
  name: 'LoadMoreButton',
  components: { IconButton },
}
</script>

<style scoped>

</style>
