<template>
  <Button @click="$emit('click')"
          class="underline rounded transition duration-200 ease-in-out hover:bg-white hover:shadow hover:no-underline m-2 p-1">
    Load more...
  </Button>
</template>

<script>
import Button from '@/components/Elements/Button'

export default {
  name: 'LoadMoreButton',
  components: { Button },
}
</script>

<style scoped>

</style>
