import type {Toaster} from '@meforma/vue-toaster'
import {createToaster} from '@meforma/vue-toaster'

const toaster = createToaster({
  useDefaultCss: false,
});

export function useToaster(): Toaster {
  return toaster;
}
