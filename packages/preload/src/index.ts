import {contextBridge} from 'electron'
import {readFileSync} from 'fs'
import type {ElectronApi} from '../types/electron-api'
import {promisify} from 'util'
import type {FsApi} from '../types/fs-api'
import {homedir} from 'os'
import type {UtilApi} from '../types/util-api'
import type {RedisClientType} from '@node-redis/client/dist/lib/client'
import RedisClient from '@node-redis/client/dist/lib/client'
import type {RedisApi} from '../types/redis-api'

const redis = require('redis')

/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
const api: ElectronApi = {
  versions: process.versions,
};

let client: RedisClientType;

const redisApi: RedisApi = {
  createClient: (options) => {
    return client = redis.createClient(options)
  },

  client: {
    connect: () => client.connect(),
    disconnect: () => client.disconnect(),
    quit: () => client.quit(),
    on: (...args) => {
      client.on(...args)
      return redisApi.client
    },
  },
};

for (const method of Object.keys(RedisClient.prototype)) {
  redisApi.client[method] = (...args: unknown[]) => {
    return client[method](...args)
  }
}


const fsApi: FsApi = {
  readFileSync,
  homedir: homedir(),
};

const utilApi: UtilApi = {
  promisify,
};

/**
 * The "Main World" is the JavaScript context that your main renderer code runs in.
 * By default, the page you load in your renderer executes code in this world.
 *
 * @see https://www.electronjs.org/docs/api/context-bridge
 */
contextBridge.exposeInMainWorld('electron', api);
contextBridge.exposeInMainWorld('redisApi', redisApi);
contextBridge.exposeInMainWorld('fsApi', fsApi);
contextBridge.exposeInMainWorld('utilApi', utilApi);
