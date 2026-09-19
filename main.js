const { app, BrowserWindow, ipcMain } = require('electron');
const { existsSync } = require('fs');
const path = require('path');
const { execFile } = require('child_process');

function helperPath() {
  return app.isPackaged ? path.join(process.resourcesPath, 'neo_windows.exe') : path.join(__dirname, 'native', 'neo_windows.exe');
}
function helper(args) {
  return new Promise((resolve, reject) => {
    execFile(helperPath(), args, { windowsHide: true, timeout: 10000 }, (error, stdout, stderr) => {
      if (error) return reject(new Error(stderr.trim() || error.message));
      try { resolve(JSON.parse(stdout)); } catch { reject(new Error('The Windows helper returned invalid data.')); }
    });
  });
}
function createWindow() {
  const win = new BrowserWindow({
    width: 1120, height: 770, minWidth: 940, minHeight: 680,
    backgroundColor: '#090c18', title: 'Neo Splitscreen',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  win.loadFile('index.html');
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

ipcMain.handle('system:info', () => ({ platform: process.platform, minecraftDirFound: existsSync(path.join(app.getPath('appData'), '.minecraft')) }));
ipcMain.handle('neo:devices', () => helper(['devices']));
ipcMain.handle('neo:windows', () => helper(['windows']));
ipcMain.handle('neo:layout', (_event, orientation) => {
  if (!['vertical', 'horizontal'].includes(orientation)) throw new Error('Unknown layout.');
  return helper(['layout', orientation]);
});
