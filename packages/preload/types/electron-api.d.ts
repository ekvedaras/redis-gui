import type RedisSshClient from 'redis-ssh'
import type {FsApi} from './fs-api'
import type {UtilApi} from './util-api';
import type {RedisApi} from './redis-api';

interface ElectronApi {
  readonly versions: Readonly<NodeJS.ProcessVersions>
}

declare global {
  interface Window {
    electron: Readonly<ElectronApi>
    electronRequire?: NodeRequire,
    redisApi: Readonly<RedisApi>,
    fsApi: Readonly<FsApi>,
    utilApi: Readonly<UtilApi>,
    redisSsh: Readonly<RedisSshClient>,
  }
}
