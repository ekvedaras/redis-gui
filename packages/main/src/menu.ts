import {MenuItemConstructorOptions, shell} from 'electron'

let isMac = process.platform === 'darwin';

export default [
  {
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
  },
  {
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
  },
] as MenuItemConstructorOptions[]
