<template>
  <div class="rounded-full w-3 h-3 shadow" :class="stateClass"/>
</template>

<script>
export default {
  name: 'StateIndicator',
  props: {
    state: {
      type: String
    }
  },
  computed: {
    stateClass () {
      switch (this.state.toLowerCase()) {
        case 'ok':
          return 'green';
        case 'pending':
          return 'orange';
        default:
          return 'red';
      }
    }
  }
}
</script>

<style scoped>
  div.green {
    @apply bg-green-500
  }

  div.orange {
    @apply bg-yellow-500
  }

  div.red {
    @apply bg-red-600
  }
</style>
