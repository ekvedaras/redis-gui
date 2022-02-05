<template>
  <div v-if="matchedCommand" class="command-info absolute rounded-t w-full py-4 px-4 bottom-0 text-gray-900 dark:text-gray-400">
    <span v-tooltip="`${upperName} documentation`" :style="{cursor: 'help'}" @click="openDocs">
      <b>{{ upperName }}</b>
    </span>
    <span class="ml-2">{{ commandInfo.args }}</span>
    <div class="text-sm mt-2">
      {{ commandInfo.summary }}
    </div>
    <IFrameModal v-if="shouldShowDocsModal" :title="docsModalTitle" :url="docsUrl" @close="shouldShowDocsModal = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useRedisCommands from '/@/use/redisCommands'
import IFrameModal from '/@/components/Elements/IFrameModal.vue'

const props = defineProps<{
  command: string
}>()

const commands = useRedisCommands()
const matchedCommand = computed(() => {
  const [firstKeyword, secondKeyword] = props.command.toLowerCase().trim().split(' ')

  if (Object.prototype.hasOwnProperty.call(commands, firstKeyword)) {
    return firstKeyword
  }

  if (Object.prototype.hasOwnProperty.call(commands, `${ firstKeyword } ${ secondKeyword }`)) {
    return `${ firstKeyword } ${ secondKeyword }`
  }

  return ''
})

const upperName = computed(() => matchedCommand.value.toUpperCase())
const commandInfo = computed(() => commands[matchedCommand.value] ?? '')
const documentation = computed(() => `https://redis.io/commands/${ matchedCommand.value.toLowerCase().replace(/ /g, '-') }`)

const shouldShowDocsModal = ref(false)
const docsModalTitle = ref('')
const docsUrl = ref('')
const openDocs = () => {
  docsModalTitle.value = `${ upperName.value } documentation`
  docsUrl.value = documentation.value
  shouldShowDocsModal.value = true
}
</script>

<style scoped>
div.command-info {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, .7)
}

@screen dark {
  div.command-info {
    background: rgba(0, 0, 0, .4)
  }
}
</style>
