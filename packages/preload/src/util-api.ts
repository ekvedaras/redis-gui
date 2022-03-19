import {exposeInMainWorld} from './exposeInMainWorld';
import {promisify} from 'node:util'

// Export for types in contracts.d.ts
export const utilApi = {
  promisify,
};

exposeInMainWorld('utilApi', utilApi);
