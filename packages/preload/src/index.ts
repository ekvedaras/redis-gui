/**
 * @module preload
 */

import './nodeCrypto';
import './versions';
import './fs-api';
import './util-api';
import './redis-api';
import './openExternal';
import './prettyBytes';
import './titlebar';

// import {contextBridge, shell} from 'electron'
// import type {ElectronApi} from '../types/electron-api'
// import type {UtilApi} from '../types/util-api'
// import type {FsApi} from '../types/fs-api'
// import {promisify} from 'util'
// import {homedir} from 'os'
// import {redisApi} from '/@/redis-api'
// import '/@/titlebar'
//
// /**
//  * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
//  */
// const api: ElectronApi = {
//   versions: process.versions,
//   openExternal: shell.openExternal,
// };
//
// /**
//  * The "Main World" is the JavaScript context that your main renderer code runs in.
//  * By default, the page you load in your renderer executes code in this world.
//  *
//  * @see https://www.electronjs.org/docs/api/context-bridge
//  */
// contextBridge.exposeInMainWorld('electron', api);
// contextBridge.exposeInMainWorld('redisApi', redisApi);
// contextBridge.exposeInMainWorld('fsApi', fsApi);
// contextBridge.exposeInMainWorld('utilApi', utilApi);
// contextBridge.exposeInMainWorld('prettyBytes', require('pretty-bytes'));
