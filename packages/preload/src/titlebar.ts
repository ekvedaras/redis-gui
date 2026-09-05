import {Titlebar, TitlebarColor} from 'custom-electron-titlebar'

let titlebar: Titlebar | undefined;
const titleBarColors = {
  dark: '#111827',
  light: '#F3F4F6',
};

const currentColor = (isDark: boolean) => TitlebarColor.fromHex(isDark ? titleBarColors.dark : titleBarColors.light)

window.addEventListener('DOMContentLoaded', () => {
  titlebar = new Titlebar({
    backgroundColor: currentColor(window.matchMedia('(prefers-color-scheme: dark)').matches),
  });
})

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  titlebar?.updateBackground(currentColor(e.matches))
});
