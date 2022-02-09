import {contextBridge, ipcRenderer, shell} from 'electron'
import {readFileSync} from 'fs'
import type {ElectronApi} from '../types/electron-api'
import {promisify} from 'util'
import type {FsApi} from '../types/fs-api'
import {homedir} from 'os'
import type {UtilApi} from '../types/util-api'
import type {RedisClientType} from '@node-redis/client/dist/lib/client'
import RedisClient from '@node-redis/client/dist/lib/client'
import type {RedisApi} from '../types/redis-api'
import {Color, Titlebar} from 'custom-electron-titlebar';

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
    select: (db: number) => client.select(db),
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

let titlebar: unknown;
const titleBarColors = {
  dark: '#111827',
  light: '#F3F4F6',
};

window.addEventListener('DOMContentLoaded', () => {
  titlebar = new Titlebar({
    backgroundColor: Color.fromHex(
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? titleBarColors.dark : titleBarColors.light,
    ),
    onMinimize: () => ipcRenderer.send('window-minimize'),
    onMaximize: () => ipcRenderer.send('window-maximize'),
    onClose: () => ipcRenderer.send('window-close'),
    isMaximized: () => ipcRenderer.sendSync('window-is-maximized'),
    onMenuItemClick: (commandId) => ipcRenderer.send('menu-event', commandId),
  });

  ipcRenderer.send('request-application-menu');
})

window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
  if (titlebar instanceof Titlebar) {
    titlebar.updateBackground(Color.fromHex(e.matches ? titleBarColors.dark : titleBarColors.light))
  }
});

ipcRenderer.on('titlebar-menu', (event, menu) => {
  if (titlebar instanceof Titlebar) {
    titlebar.updateMenu(menu)
    titlebar.updateTitle('Redis GUI')
  }
})

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
