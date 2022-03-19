import type * as prettyBytes from 'pretty-bytes'

export default function usePrettyBytes(): (length: number, options?: prettyBytes.Options) => string {
  return window.prettyBytes
}
