<script setup lang="ts">
import type ConsoleLog from '/@/models/ConsoleLog'
import { computed, ref } from 'vue'
import { useJson } from '/@/use/json'
import { useToaster } from '/@/use/toaster'
import JsonRenderer from '/@/components/Elements/JsonRenderer.vue'
import IconButton from '/@/components/Elements/IconButton.vue'
import DownIcon from '/@/components/Icons/DownIcon.vue'
import UpIcon from '/@/components/Icons/UpIcon.vue'
import RefreshIcon from '/@/components/Icons/RefreshIcon.vue'
import DocumentIcon from '/@/components/Icons/DocumentIcon.vue'
import CodeIcon from '/@/components/Icons/CodeIcon.vue'
import WordBreakIcon from '/@/components/Icons/WordBreakIcon.vue'

const props = defineProps<{
  log: ConsoleLog,
}>()

const emit = defineEmits<{
  (e: 'rerun', command: string): void,
}>()

const shouldAttemptJson = computed(() => typeof props.log.content === 'string' && props.log.content.length < 1024 * 10 && (props.log.content.startsWith('[') || props.log.content.startsWith('{')))
const { isJSON: _isJson } = useJson()
const isJSON = computed(() => typeof props.log.content === 'string' && _isJson(props.log.content))

const collapsed = ref(false)
const breakWords = ref(false)
const asJson = ref(shouldAttemptJson.value && isJSON.value)

const toaster = useToaster()
const copy = () => {
  // this.$copyText(props.log.content)
  alert('TODO copy content')
  toaster.info('Copied')
}
</script>

<template>
  <div class="overflow-x-auto relative" :class="{'text-redis': log.isError, 'sent-command rounded-t border-b z-30 border-gray-200 dark:border-gray-800 mb-2 -mx-4 font-bold sticky py-2 px-4 top-0 shadow-sm bg-white dark:bg-black': log.wasSent}">
    <div class="absolute z-20 top-0 right-0 bg-white-80p dark:bg-black-50p rounded flex space-x-2 items-center" :class="{'mt-2 mr-2': log.wasSent}">
      <IconButton v-if="!log.wasSent" @click="collapsed = !collapsed">
        <DownIcon v-if="collapsed" class="w-5" />
        <UpIcon v-else class="w-5" />
      </IconButton>
      <IconButton v-if="log.wasSent" @click="emit('rerun', String(log.content))">
        <RefreshIcon class="w-5" />
      </IconButton>
      <IconButton @click="copy">
        <DocumentIcon class="w-5" />
      </IconButton>
      <IconButton v-if="!log.wasSent && typeof log.content !== 'object' && isJSON" @click="asJson = !asJson">
        <CodeIcon class="w-5" />
      </IconButton>
      <IconButton v-if="!log.wasSent && !asJson" class="z-10" @click="breakWords = !breakWords">
        <WordBreakIcon class="w-4 m-1" />
      </IconButton>
    </div>
    <div :class="{'h-6 overflow-hidden': collapsed}">
      <div v-if="typeof log.content === 'object'">
        <table class="compact">
          <tbody>
            <tr v-for="(entry, index) in log.content" :key="index">
              <th class="text-right">
                {{ index }})
              </th>
              <td class="text-left">
                {{ entry }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else-if="log.wasSent">
        > {{ log.content }}
      </div>
      <div v-else>
        <JsonRenderer v-if="asJson" :data="log.content" without-controls />
        <div v-else :class="breakWords ? 'break-all' : 'whitespace-pre'">
          {{ log.content }}
        </div>
      </div>
    </div>
    <div v-if="collapsed" class="inline cursor-pointer leading-none collapse-indicator rounded text-gray-500 dark:text-gray-600 bg-gray-200 dark:bg-gray-900 px-2" @click="collapsed = false">
      •••
    </div>
  </div>
</template>

<style scoped>
div.collapse-indicator {
  font-size: .7rem;
}
</style>
