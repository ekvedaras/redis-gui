import {exposeInMainWorld} from './exposeInMainWorld';
import {shell} from 'electron';

// Export for types in contracts.d.ts
export const openExternal = shell.openExternal;

exposeInMainWorld('openExternal', openExternal);
