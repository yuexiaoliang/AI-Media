import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';

process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.webContents.openDevTools({ mode: 'detach' });

  const dev_url = process.env['VITE_DEV_SERVER_URL'];
  if (dev_url) {
    win.loadURL(dev_url);
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on('send-test', (_, val) => {
  console.log(val);
});

ipcMain.handle('invoke-test', async (_, val) => {
  return val + 'bc';
});
