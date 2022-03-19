import {Color, Titlebar} from 'custom-electron-titlebar'
import {ipcRenderer} from 'electron'

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
})

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
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
