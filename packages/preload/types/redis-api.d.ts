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

  test(options?: RedisClientOptions, onSuccess: () => void, onError: (error: string) => void): Promise<void>,

  client: RedisClient | RedisExtension
}
