import { Color, Titlebar } from 'custom-electron-titlebar'
import { remote, shell } from 'electron'

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
if (!menu.getMenuItemById('redis')) {
  menu.append(new remote.MenuItem({
    label: 'Redis',
    id: 'redis',
    submenu: [
      {
        label: 'Commands',
        click: () => shell.openExternal('https://redis.io/commands'),
      },
      {
        label: 'Documentation',
        click: () => shell.openExternal('https://redis.io/documentation'),
      },
    ],
  }))
}

if (!menu.getMenuItemById('redis-gui')) {
  menu.append(new remote.MenuItem({
    label: 'Redis GUI',
    id: 'redis-gui',
    submenu: [
      {
        label: 'GitHub',
        click: () => shell.openExternal('https://github.com/ekvedaras/redis-gui'),
      },
      {
        label: 'Create issue',
        click: () => shell.openExternal('https://github.com/ekvedaras/redis-gui/issues/new'),
      },
      {
        label: 'Twitter',
        click: () => shell.openExternal('https://twitter.com/ekvedaras'),
      },
    ],
  }))

}
titleBar.updateMenu(menu)
