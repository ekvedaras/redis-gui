import type {Callback, Multi, RedisClient as BaseRedisClient} from 'redis'
import type {Server} from '/@/use/database'

export type Key = {
  name: string,
  type: string,
  ttl: number,
  encoding: string,
};

type Keys = {
  [key: string]: Key,
}

export type AsyncResult = [string, string[]?]

export type KeysResult = {
  nextCursor: number,
  keys: Keys,
}

interface RedisClient extends BaseRedisClient {
  [key: string]: () => unknown,
}

type RedisClients = {
  [key: string]: RedisClient,
}

type CommandPromise = {
  [key: string]: Promise,
}

type Promises = {
  [key: string]: CommandPromise,
}

export type Redis = {
  pageSize: number,
  namespaceSeparator: string,
  current: string,
  client: RedisClients,
  promises: Promises,
  beSilent: boolean,
  connect: (server?: string = 'default', onReady?: () => void) => Promise<RedisClient>,
  createClient: (config: Server) => Promise<RedisClient>,
  disconnect: (server: string) => void,
  silently: () => Redis
  async: (command: string, ...args: unknown[]) => Promise<unknown>,
  multi: (args?: Array<Array<string | number | Callback<unknown>>>) => Promise<Multi>,
  keys: (pattern: string, limit: number, cursor: number) => Promise<KeysResult>,
};

