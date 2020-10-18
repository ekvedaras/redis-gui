<template>
  <Button @click="$emit('click')"
          :type="type"
          class="shadow hover:bg-redis focus:bg-redis bg-red-700 text-white hover:text-white focus:text-white hover:no-underline focus:no-underline">
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
