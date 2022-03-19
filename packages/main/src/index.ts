import type {MenuItem} from 'electron'
import {app, BrowserWindow, ipcMain, Menu} from 'electron'
import menu from '/@/menu'
import './security-restrictions'
import {restoreOrCreateWindow} from '/@/mainWindow'


/**
 * Prevent multiple instances
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);


/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', restoreOrCreateWindow);


/**
 * Create app window when background process will be ready
 */
app.whenReady()
  .then(restoreOrCreateWindow)
  .catch((e) => console.error('Failed create window:', e));


/**
 * Install Vue.js or some other devtools in development mode only
 */
if (import.meta.env.DEV) {
  app.whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({default: installExtension, VUEJS3_DEVTOOLS}) => installExtension(VUEJS3_DEVTOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    }))
    .catch(e => console.error('Failed install extension:', e));
}

/**
 * Check new app version in production mode only
 */
if (import.meta.env.PROD) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e));
}

ipcMain.handle('request-application-menu', function (event) {
  const menu = Menu.getApplicationMenu();
  const jsonMenu = JSON.parse(JSON.stringify(menu, parseMenu()));
  event.sender.send('titlebar-menu', jsonMenu);
});

ipcMain.on('menu-event', (event, commandId) => {
  const menu = Menu.getApplicationMenu();
  const item = getMenuItemByCommandId(commandId, menu);
  item?.click(undefined, BrowserWindow.fromWebContents(event.sender), event.sender);
});

// Parse menu to send it to the title bar
const parseMenu = () => {
  const menu = new WeakSet();
  return (key: string, value?: object) => {
    if (key === 'commandsMap') return;
    if (typeof value === 'object' && value !== null) {
      if (menu.has(value)) return;
      menu.add(value);
    }
    return value;
  };
}

// Gets the menu item on click
const getMenuItemByCommandId = (commandId: number, menu = Menu.getApplicationMenu()): MenuItem | null => {
  let menuItem: MenuItem | undefined;
  menu?.items.forEach(item => {
    if (item.submenu) {
      const submenuItem = getMenuItemByCommandId(commandId, item.submenu);
      if (submenuItem) menuItem = submenuItem;
    }
    if (item.commandId === commandId) menuItem = item;
  });

  return menuItem || null;
};

app.whenReady()
  .then(() => {
    const current = Menu.getApplicationMenu()
    const newMenu = Menu.buildFromTemplate(menu)
    const appMenu = Menu.buildFromTemplate([])

    current?.items.filter(item => item.label !== 'Help').forEach(item => appMenu?.append(item))
    newMenu.items.forEach(item => appMenu?.append(item))

    Menu.setApplicationMenu(appMenu)
  })
  .catch((e) => console.error('Failed to build menu:', e));
