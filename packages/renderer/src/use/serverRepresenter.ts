import type {Server} from '../../types/database'

export function useServerRepresenter() {
  return {
    representServer: (server: Server) => {
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
