import {BrowserWindow} from 'electron';
import {attachTitlebarToWindow} from 'custom-electron-titlebar/main';
import {join} from 'path';
import {URL} from 'url';

async function createWindow() {
  const browserWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    titleBarStyle: 'hidden',
    frame: false,
    webPreferences: {
      sandbox: false, // preload loads ssh2/redis from node_modules, which a sandboxed preload cannot do
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(__dirname, '../../preload/dist/index.cjs'),
    },
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl = import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();


  attachTitlebarToWindow(browserWindow);

  await browserWindow.loadURL(pageUrl);

  /**
   * The window is created hidden so it never appears half-painted.
   * `ready-to-show` never fires for a hidden window on Wayland, so the load
   * completing is what we wait for instead.
   */
  browserWindow.show();

  if (import.meta.env.DEV) {
    browserWindow.webContents.openDevTools();
  }

  return browserWindow;
}

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}
