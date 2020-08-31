<template>
  <div class="flex flex-col">
    <input type="text" placeholder="Search..." v-model="search" class="mx-2 p-2 rounded shadow"/>
    <Keys :keys="groupedKeys" :level="0"/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'KeysSidebar',
  data: () => ({
    search: '',
  }),
  watch: {
    search() {
      this.$store.dispatch('loadKeys', `*${this.search}*`)
    }
  },
  mounted () {
    this.loadKeys()
  },
  methods: mapActions(['loadKeys']),
  computed: {
    ...mapState(['keys']),
    groupedKeys () {
      let grouped = {}

      Object.entries(this.keys).forEach(([name, key]) => {
        if (name.indexOf(':') < 0) {
          grouped[name] = key
          return true
        }

        _.setWith(grouped, name.replace(/:/g, '.'), key, Object)
      })

      return grouped
    },
  },
}
</script>

<style scoped>

</style>
