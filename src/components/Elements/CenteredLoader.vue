<template>
  <div class="flex w-full h-full justify-center items-center">
    Loading
    <Spinner class="relative ml-2"/>
  </div>
</template>

<script>
import Spinner from '@/components/Elements/Spinner'

export default {
  name: 'CenteredLoader',
  components: { Spinner },
}
</script>

<style scoped>

</style>
