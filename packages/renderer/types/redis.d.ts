import type {Server} from '/@/use/database'
import type {RedisClient, RedisClientOptions, RedisClientType} from '@node-redis/client/dist/lib/client';
import type {RedisExtension} from '../../preload/types/redis-api';

export type Key = {
  name: string,
  type: string,
  ttl: number,
  encoding: string,
};

export type KeysResult = {
  nextCursor: number,
  keys: Record<string, Key>,
}

export type Redis = {
  pageSize: number,
  namespaceSeparator: string,
  client: RedisClient & RedisClientType & RedisExtension | null,
  connect: (server: string, options?: { onReady?: () => void }) => Promise<RedisClientType>,
  buildConnectionConfig: (config: Server) => RedisClientOptions,
  disconnect: () => Promise<void>,
  keys: (pattern: string, limit: number, cursor: number) => Promise<KeysResult>,
};

