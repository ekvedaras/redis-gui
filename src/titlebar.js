import { Color, Titlebar } from 'custom-electron-titlebar'
import { remote, shell } from 'electron'
import { findIndex } from 'lodash'

const titleBarColors = {
  dark: '#111827',
  light: '#F3F4F6',
}

let titleBar = new Titlebar({
  backgroundColor: Color.fromHex(
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? titleBarColors.dark : titleBarColors.light,
  ),
})

titleBar.updateTitle('Redis GUI')
window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
  titleBar.updateBackground(Color.fromHex(e.matches ? titleBarColors.dark : titleBarColors.light))
})

const menu = remote.Menu.getApplicationMenu()

if (!menu.getMenuItemById('help')) {
  // Remove default Help item
  let items = menu.items
  let helpIndex = findIndex(items, { label: 'Help' })
  delete items[helpIndex]
  items.splice(helpIndex, 1)
  menu.items = items

  menu.append(new remote.MenuItem({
    label: 'Help',
    id: 'help',
    submenu: [
      {
        label: 'Commands',
        click: () => shell.openExternal('https://redis.io/commands'),
      },
      {
        label: 'Documentation',
        click: () => shell.openExternal('https://redis.io/documentation'),
      },
      {
        label: 'Create issue',
        click: () => shell.openExternal('https://github.com/ekvedaras/redis-gui/issues/new'),
      },
    ],
  }))
}

if (!menu.getMenuItemById('follow')) {
  menu.append(new remote.MenuItem({
    label: 'Follow',
    id: 'follow',
    submenu: [
      {
        label: 'Releases',
        click: () => shell.openExternal('https://github.com/ekvedaras/redis-gui/releases'),
      },
      {
        label: 'GitHub',
        click: () => shell.openExternal('https://github.com/ekvedaras'),
      },
      {
        label: 'Twitter',
        click: () => shell.openExternal('https://twitter.com/ekvedaras'),
      },
    ],
  }))

}
titleBar.updateMenu(menu)
