import {getCurrentInstance} from 'vue'

export default function useEmitter() {
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error('[useEmitter] must be called in a Vue component.');
  }

  return instance.appContext.config.globalProperties.emitter;
}
