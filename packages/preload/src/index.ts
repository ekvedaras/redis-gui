import {contextBridge} from 'electron'
import {createClient} from 'redis'
import RedisSsh from 'redis-ssh'
import {readFileSync} from 'fs'
import type {ElectronApi} from '../types/electron-api'
import {promisify} from 'util'
import type {FsApi} from '../types/fs-api'
import {homedir} from 'os'

const apiKey = 'electron';
/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
const api: ElectronApi = {
  versions: process.versions,
};

const fsApi: FsApi = {
  readFileSync,
  homedir: homedir(),
};

/**
 * The "Main World" is the JavaScript context that your main renderer code runs in.
 * By default, the page you load in your renderer executes code in this world.
 *
 * @see https://www.electronjs.org/docs/api/context-bridge
 */
contextBridge.exposeInMainWorld(apiKey, api);
contextBridge.exposeInMainWorld('createRedisClient', createClient);
contextBridge.exposeInMainWorld('redisSsh', RedisSsh);
contextBridge.exposeInMainWorld('fsApi', fsApi);
contextBridge.exposeInMainWorld('promisify', promisify);
