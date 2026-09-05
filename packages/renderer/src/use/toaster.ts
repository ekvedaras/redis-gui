import {ref} from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export type Toast = {
  id: number,
  type: ToastType,
  message: string,
};

export const toasts = ref<Toast[]>([])

let nextId = 0

const push = (type: ToastType) => (message: string) => {
  const id = nextId++
  toasts.value.push({id, type, message})
  setTimeout(() => toasts.value = toasts.value.filter(toast => toast.id !== id), 4000)
}

const toaster = {
  success: push('success'),
  error: push('error'),
  info: push('info'),
}

export function useToaster(): typeof toaster {
  return toaster
}
