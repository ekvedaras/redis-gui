import type {RedisClient, RedisClientOptions, RedisClientType} from '@node-redis/client/dist/lib/client'

type ServerConfig = {
  host: string
  port: number
  password?: string
}

export interface RedisExtension {
  isConnectionOpen(): boolean
}

export interface RedisApi {
  createClient(options?: RedisClientOptions): RedisClientType,

  client: RedisClient | RedisExtension
}
