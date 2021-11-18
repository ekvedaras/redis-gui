import type {RedisClient} from '../../renderer/types/redis'
import type {ClientOpts} from 'redis'

export interface RedisApi {
  createClient(options?: ClientOpts): RedisClient,
}
