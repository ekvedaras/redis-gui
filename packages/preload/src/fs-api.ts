import {exposeInMainWorld} from './exposeInMainWorld';
import {homedir} from 'node:os'

// Export for types in contracts.d.ts
export const fsApi = {
  homedir: homedir(),
};

exposeInMainWorld('fsApi', fsApi);
