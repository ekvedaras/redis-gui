import {getCurrentInstance} from 'vue'

export default function useEmitter() {
  return getCurrentInstance()!.appContext.config.globalProperties.emitter;
}
