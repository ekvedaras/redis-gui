<template>
  <div>
    <ul class="flex w-full border-b border-gray-400 dark:border-gray-700 overflow-x-auto">
      <li v-for="tab in list"
          :key="tab.key"
          @click="select(tab)"
          class="p-2 tracking-wider"
          :class="{'font-semibold text-redis': tab.selected}">
        {{ tab.key }}
      </li>
    </ul>
    <div class="py-4 px-2 overflow-y-auto" :style="{maxHeight: '75vh'}">
      <component v-for="tab in list" :key="tab.key" v-show="tab.selected" :is="tab.component" v-bind="tab.props"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    tabs: Object,
  },
  data: () => ({
    list: [],
  }),
  created () {
    let first = Object.keys(this.tabs)[0]
    this.list = Object.entries(this.tabs).map(([name, tab]) => ({
      key: name,
      selected: name === first,
      props: tab.props,
      component: tab.component,
    }))
  },
  methods: {
    select (target) {
      this.list.forEach(tab => {
        tab.selected = tab === target
      })
    },
  },
}
</script>

<style scoped>

</style>
