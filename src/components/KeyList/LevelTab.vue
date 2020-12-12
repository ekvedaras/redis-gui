<template>
  <div :style="style"></div>
</template>

<script>
export default {
  name: 'LevelTab',
  props: ['level'],
  computed: {
    style () {
      return {
        minWidth: `${this.level * 20}px`,
      }
    },
  },
}
</script>

<style scoped>

</style>
