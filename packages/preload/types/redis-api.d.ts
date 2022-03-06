import type {RedisClient, RedisClientOptions, RedisClientType} from '@node-redis/client/dist/lib/client'
import type {SshConfig} from '../../renderer/types/database'

type ServerConfig = {
  host: string
  port: number
  password?: string
}

export interface RedisExtension {
  isConnectionOpen(): boolean
}

export interface RedisApi {
  connectingTo: string,

  createClient(server: string, options?: RedisClientOptions): RedisClientType,

  createClientThroughSsh(server: string, sshOptions: SshConfig, redisOptions?: RedisClientOptions): Promise<RedisClientType>,

  test(options?: RedisClientOptions, onSuccess: () => void, onError: (error: string) => void): Promise<void>,

  testThroughSsh(sshOptions: SshConfig, redisOptions?: RedisClientOptions, onSuccess: () => void, onError: (error: string) => void): Promise<void>,

  client: RedisClient | RedisExtension
}
