import {createToaster} from '@meforma/vue-toaster'

const toaster = createToaster();

export function useToaster() {
  return toaster;
}
