import {onKeyStroke} from '@vueuse/core'
import type {ClickKeys} from 'types/models'

const modifiers = {
  ctrl: 'ctrlKey',
  shift: 'shiftKey',
  alt: 'altKey',
  meta: 'metaKey',
} as const

const matches = (event: KeyboardEvent, keys: string[]) => {
  const key = event.key.toLowerCase()

  return !(key in modifiers)
    && keys.includes(key)
    && Object.entries(modifiers).every(([name, flag]) => keys.includes(name) === event[flag])
}

const isTyping = (event: KeyboardEvent) => ['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement | null)?.tagName ?? '')

export function useShortcut(keys: string[] | ClickKeys, handler: () => void): void {
  const main = Array.isArray(keys) ? keys : keys.main
  const forced = Array.isArray(keys) ? undefined : keys.forced

  onKeyStroke(
    event => (!!forced && matches(event, forced)) || (!isTyping(event) && matches(event, main)),
    event => {
      event.preventDefault()
      handler()
    },
  )
}
