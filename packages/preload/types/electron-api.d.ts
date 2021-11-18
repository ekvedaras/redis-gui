import type {ClientOpts, RedisClient} from 'redis'
import type RedisSshClient from 'redis-ssh'
import type {FsApi} from './fs-api'

interface ElectronApi {
  readonly versions: Readonly<NodeJS.ProcessVersions>
}

declare global {
  interface Window {
    electron: Readonly<ElectronApi>
    electronRequire?: NodeRequire,
    fsApi: Readonly<FsApi>,
    redisSsh: Readonly<RedisSshClient>,

    promisify(fn: () => unknown): () => unknown,

    createRedisClient(opts: ClientOpts): RedisClient,
  }
}
