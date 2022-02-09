import type {MenuItem} from 'electron';
import {app, BrowserWindow, ipcMain, Menu, shell} from 'electron'
import {join} from 'path'
import {URL} from 'url'
import menu from '/@/menu'


const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

app.disableHardwareAcceleration();

// Install "Vue.js devtools"
if (import.meta.env.MODE === 'development') {
  app.whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({default: installExtension, VUEJS3_DEVTOOLS}) => installExtension(VUEJS3_DEVTOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    }))
    .catch(e => console.error('Failed install extension:', e));
}

let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    titleBarStyle: 'hidden',
    frame: false,
    webPreferences: {
      nativeWindowOpen: true,
      preload: join(__dirname, '../../preload/dist/index.cjs'),
    },
  });

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();

    if (import.meta.env.MODE === 'development') {
      mainWindow?.webContents.openDevTools();
    }
  });

  /**
   * External hyperlinks open in the default browser.
   *
   * @see https://stackoverflow.com/a/67409223
   */
  mainWindow.webContents.setWindowOpenHandler(({url}) => {
    shell.openExternal(url);
    return {action: 'deny'};
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl = import.meta.env.MODE === 'development' && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();


  await mainWindow.loadURL(pageUrl);
};


app.on('second-instance', () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

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

app.whenReady()
  .then(createWindow)
  .catch((e) => console.error('Failed create window:', e));


// Auto-updates
if (import.meta.env.PROD) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e));
}

ipcMain.on('window-minimize', function (event) {
  BrowserWindow.fromWebContents(event.sender)?.minimize();
})

ipcMain.on('window-maximize', function (event) {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.isMaximized() ? window?.unmaximize() : window?.maximize();
})

ipcMain.on('window-close', function (event) {
  BrowserWindow.fromWebContents(event.sender)?.close()
})

ipcMain.on('window-is-maximized', function (event) {
  event.returnValue = BrowserWindow.fromWebContents(event.sender)?.isMaximized()
})

ipcMain.on('request-application-menu', function (event) {
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
