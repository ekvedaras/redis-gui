<template>
  <div class="relative flex flex-1 justify-center items-center">
    <!--suppress HtmlFormInputWithoutLabel -->
    <input type="text" placeholder="Search..." :value="value" @input="$emit('input', $event.target.value)" class="py-2 px-3 w-full"/>
    <Spinner :class="[showSpinner ? 'opacity-100' : 'opacity-0']"/>
  </div>
</template>

<script>
import Spinner from '@/components/Elements/Spinner'

export default {
  name: 'Search',
  components: { Spinner },
  props: ['value', 'showSpinner'],
}
</script>

<style scoped>

</style>
