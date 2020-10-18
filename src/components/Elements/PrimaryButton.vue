<template>
  <Button @click="$emit('click')"
          :type="type"
          class="shadow hover:bg-redis bg-red-700 text-white hover:text-white">
    <slot/>
  </Button>
</template>

<script>
import Button from '@/components/Elements/Button'

export default {
  name: 'PrimaryButton',
  components: { Button },
  props: {
    type: {
      type: String,
      default: 'button',
    },
  },
}
</script>

<style scoped>

</style>
