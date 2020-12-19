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

const menu = new remote.Menu()
menu.append(new remote.MenuItem({
  label: 'Info',
  submenu: [
    {
      label: 'GitHub',
      click: () => shell.openExternal('https://github.com/ekvedaras/redis-gui'),
    },
    {
      label: 'Redis commands',
      click: () => shell.openExternal('https://redis.io/commands'),
    },
    {
      label: 'Redis documentation',
      click: () => shell.openExternal('https://redis.io/documentation'),
    },
  ],
}))
menu.append(new remote.MenuItem({
  label: 'Help',
  submenu: [
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

titleBar.updateMenu(menu)
