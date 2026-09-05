import {app, Menu} from 'electron'
import {setupTitlebar} from 'custom-electron-titlebar/main'
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

setupTitlebar();


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
    .then(({default: installExtension, VUEJS_DEVTOOLS}) => installExtension(VUEJS_DEVTOOLS, {
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
