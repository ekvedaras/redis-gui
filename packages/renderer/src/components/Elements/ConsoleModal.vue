<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useDatabase } from '/@/use/database'
import { useServersStore } from '/@/store/servers'
import { useRedis } from '/@/use/redis'
import AppModal from '/@/components/Elements/AppModal.vue'
import CommandInfo from '/@/components/Elements/CommandInfo.vue'
import ConsoleLogLine from '/@/components/Elements/ConsoleLogLine.vue'
import Button from '/@/components/Elements/Button.vue'
import ConsoleLog from '/@/models/ConsoleLog'
import ErrorResponse from '/@/models/ErrorResponse'
import SentCommand from '/@/models/SentCommand'

const emit = defineEmits<{
  (e: 'close'): void;
}>()

const log = ref<ConsoleLog[]>([])
const historyIndex = ref(-1)
const command = ref('')
const hideInfo = ref(false)
const input = ref<HTMLInputElement>()

onMounted(() => nextTick(() => input.value?.focus()))
watch(() => command.value, () => hideInfo.value = false)

const database = useDatabase()
const serversStore = useServersStore()
const placeholder = computed(() => {
  let server = database.data.servers[serversStore.selected]

  if (server.host) {
    return `${ server.host }:${ server.port }>`
  }

  if (server.path) {
    return `${ server.path }>`
  }

  if (server.url) {
    return `${ server.url }>`
  }

  return 'Type Redis command'
})


const history = (previous: boolean) => {
  if (previous) {
    historyIndex.value = Math.max(-1, historyIndex.value - 1)
  } else {
    historyIndex.value += 1
  }

  const cmd = database.data.history[serversStore.selected][historyIndex.value]

  if (cmd !== undefined) {
    command.value = cmd
  } else if (!previous) {
    historyIndex.value--
  }
}

const logDiv = ref<HTMLDivElement>()
const redis = useRedis()
const send = async (cmd?: string) => {
  if (cmd) {
    command.value = cmd
  }

  if (command.value.toLowerCase().trim() === 'clear') {
    historyIndex.value = -1
    log.value = []
    command.value = ''
    return
  }

  historyIndex.value = -1
  log.value.push(new SentCommand(command.value))

  let history = database.data.history[serversStore.selected]
  history.unshift(command.value)
  history = history.slice(0, 100)
  database.data.history[serversStore.selected] = history
  database.write()


  try {
    const result = await redis.client.sendCommand(
      command.value.match(/(?:[^\s"]+|"[^"]*")+/g)
        ?.map(s => s.replace(/^"/, '').replace(/"$/, '')),
    )
    if (result === null) {
      log.value.push(new ConsoleLog('(nil)'))
    } else {
      log.value.push(new ConsoleLog(result))
    }

    command.value = ''
  } catch (e) {
    log.value.push(new ErrorResponse(e))
    hideInfo.value = true
  } finally {
    await nextTick(() => logDiv.value && (logDiv.value.scrollTop = logDiv.value.scrollHeight))
  }
}
</script>

<template>
  <AppModal
    id="console-modal"
    title="Console"
    full-height
    full-width
    @close="emit('close')"
  >
    <div class="rounded bg-white dark:bg-black w-full font-mono shadow flex-1 flex flex-col">
      <div class="relative flex-1">
        <CommandInfo
          v-if="!hideInfo"
          :command="command"
          class="z-40"
        />
        <div
          ref="logDiv"
          class="overflow-y-auto pb-4 px-4 relative"
          :style="{maxHeight: '70vh', scrollBehavior: 'smooth'}"
        >
          <ConsoleLogLine
            v-for="(line, i) in log"
            :key="i"
            :log="line"
            @rerun="send"
          />
        </div>
      </div>
      <input
        ref="input"
        v-model="command"
        type="text"
        :placeholder="placeholder"
        class="border-t border-gray-200 bg-transparent py-2 px-4 w-full font-mono shadow-none rounded-t-none"
        @keydown.up.prevent="history(false)"
        @keydown.down="history(true)"
        @keydown.enter="send()"
      >
    </div>

    <div class="flex justify-end space-x-4">
      <Button @click="emit('close')">
        Close
      </Button>
    </div>
  </AppModal>
</template>

<style scoped>
#console-modal {
  min-height: 400px;
}
</style>
