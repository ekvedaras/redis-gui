<template>
  <div>
    <ul class="flex w-full border-b border-gray-400 dark:border-gray-700 overflow-x-auto">
      <li v-for="tab in list"
          :key="tab.key"
          @click="select(tab)"
          class="p-2 tracking-wider cursor-pointer"
          :class="{'font-semibold text-redis': tab.selected}">
        {{ tab.key }}
      </li>
    </ul>
    <div class="py-4 px-2 overflow-y-auto" :style="{maxHeight: '75vh'}">
      <component v-for="tab in list" :key="tab.key" v-show="tab.selected" :is="tab.component" v-bind="tab.props" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import TableInfo from '/@/components/Elements/TableInfo.vue'
import KeyspaceInfo from '/@/components/Elements/KeyspaceInfo.vue'

export interface PropTab {
  props: { info: Record<string, string> },
  component: InstanceType<typeof TableInfo | typeof KeyspaceInfo>,
}

interface PropTabs {
  [key: string]: PropTab
}

interface Tab {
  key: string,
  selected: boolean,
  props: PropTab['props'],
  component: PropTab['component'],
}

const props = defineProps<{
  tabs: PropTabs
}>()

const list = ref<Tab[]>([])

onBeforeMount(() => {
  let first = Object.keys(props.tabs)[0]
  list.value = Object.entries(props.tabs).map(([name, tab]) => ({
    key: name,
    selected: name === first,
    props: tab.props,
    component: tab.component,
  }))
})

const select = (target: Tab) => {
  list.value.forEach(tab => {
    tab.selected = tab === target
  })
}
</script>

<style scoped>

</style>
