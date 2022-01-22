import {contextBridge, shell} from 'electron'
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
const prettyBytes = require('pretty-bytes')

/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
const api: ElectronApi = {
  versions: process.versions,
  openExternal: shell.openExternal,
};

let client: RedisClientType;
let testClient: RedisClientType;

const redisApi: RedisApi = {
  createClient: (options) => {
    return client = redis.createClient(options);
  },

  client: {
    isConnectionOpen: () => client.isOpen,
    connect: () => client.connect(),
    disconnect: () => client.disconnect(),
    quit: () => client.quit(),
    // @ts-ignore
    on: (...args) => {
      // @ts-ignore
      client.on(...args)
      return redisApi.client
    },
    // @ts-ignore
    sendCommand: (...args) => client.sendCommand(...args),
  },
};

for (const method of Object.keys(RedisClient.prototype)) {
  // @ts-ignore
  redisApi.client[method] = (...args) => client[method](...args)
}

const testRedisApi: RedisApi = {
  createClient: (options) => {
    return testClient = redis.createClient(options);
  },

  client: {
    isConnectionOpen: () => testClient.isOpen,
    connect: () => testClient.connect(),
    disconnect: () => testClient.disconnect(),
    quit: () => testClient.quit(),
    // @ts-ignore
    on: (...args) => {
      // @ts-ignore
      testClient.on(...args)
      return testRedisApi.client
    },
    // @ts-ignore
    sendCommand: (...args) => testClient.sendCommand(...args),
  },
};

for (const method of Object.keys(RedisClient.prototype)) {
  // @ts-ignore
  testRedisApi.client[method] = (...args) => testClient[method](...args)
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
contextBridge.exposeInMainWorld('testRedisApi', testRedisApi);
contextBridge.exposeInMainWorld('fsApi', fsApi);
contextBridge.exposeInMainWorld('utilApi', utilApi);
contextBridge.exposeInMainWorld('prettyBytes', prettyBytes);
