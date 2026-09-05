import type {Server} from '../../types/database'

export function useServerRepresenter() {
  return {
    // The selected server can briefly be missing from the list, both while connecting and
    // after the selected one is deleted, so a lookup that misses must not break rendering.
    representServer: (server?: Server) => {
      if (!server) {
        return ''
      }

      if (server.host) {
        return server.host
      }

      if (server.path) {
        return server.path.substring(server.path.lastIndexOf('/') + 1)
      }

      if (server.url) {
        return new URL(server.url.replace(/^redis(s)?/, 'http')).hostname
      }

      return server.name
    },
  }
}
