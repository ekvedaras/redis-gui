export default {
  computed: {
    hasItems() {
      if (typeof this.value === 'object') {
        return !!Object.keys(this.value).length
      }

      return !!this.value.length
    }
  }
}
