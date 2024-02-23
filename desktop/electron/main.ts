import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { register } from './controller';

process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

const isDev = process.env.NODE_ENV === 'development';

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: isDev ? 1200 : 800,
    height: 600,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (isDev) win.webContents.openDevTools();

  const dev_url = process.env['VITE_DEV_SERVER_URL'];
  if (dev_url) {
    win.loadURL(dev_url);
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    register();
  });

  ipcMain.on('send-test', (_, val) => {
    console.log(val);
  });

  ipcMain.handle('invoke-test', async (_, val) => {
    return val + 'bc';
  });
}
