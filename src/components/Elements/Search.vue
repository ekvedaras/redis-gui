<template>
  <div class="relative flex flex-1 justify-center items-center">
    <!--suppress HtmlFormInputWithoutLabel -->
    <input type="text" placeholder="Search..." :value="value" v-shortkey.focus="focusKeys" @input="$emit('input', $event.target.value)" @keydown.esc="$event.target.blur" class="py-2 px-3 w-full"/>
    <Spinner :class="[showSpinner ? 'opacity-100' : 'opacity-0']"/>
  </div>
</template>

<script>
import Spinner from '@/components/Elements/Spinner'

export default {
  name: 'Search',
  components: { Spinner },
  props: {
    value: String,
    showSpinner: Boolean,
    focusKeys: {
      default: () => ['/'],
    },
  },
}
</script>

<style scoped>

</style>
