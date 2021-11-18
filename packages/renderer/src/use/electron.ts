import type {ElectronApi} from '../../../preload/types/electron-api'

export function useElectron(): Readonly<ElectronApi> {
  return window.electron;
}
