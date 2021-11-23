import {RedisClient, RedisClientOptions} from '@node-redis/client/dist/lib/client';

type ServerConfig = {
  host: string
  port: number
  password?: string
}

export interface RedisApi {
  createClient(options?: RedisClientOptions): RedisClient,
}
