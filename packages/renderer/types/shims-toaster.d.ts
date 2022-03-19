declare module '@meforma/vue-toaster' {
  import type {VNode} from 'vue'

  type Toast = {
    vNode: VNode,
    destroy: () => void,
    el: HTMLElement,
  };

  export type ToasterOptions = {
    position?: 'top' | 'bottom' | 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left',
    duration?: number,
    dismissible?: boolean,
    onClick?: () => void,
    onClose?: () => void,
    queue?: boolean,
    maxToasts?: number,
    pauseOnHover?: boolean,
    useDefaultCss?: boolean,
  }

  export type Toaster = {
    show(message: string, options: ?ToasterOptions = {}): Toast,
    clear(): void,
    success(message: string, options: ?ToasterOptions = {}): Toast,
    error(message: string, options: ?ToasterOptions = {}): Toast,
    info(message: string, options: ?ToasterOptions = {}): Toast,
    warning(message: string, options: ?ToasterOptions = {}): Toast,
  };

  export const createToaster = (defaults?: ToasterOptions): Toaster => {
    return Toaster(defaults)
  };
}
