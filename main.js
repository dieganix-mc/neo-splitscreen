const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { existsSync, mkdirSync, copyFileSync } = require('fs');
const path = require('path');
const { execFile } = require('child_process');

function helperPath() {
  return app.isPackaged ? path.join(process.resourcesPath, 'neo_windows.exe') : path.join(__dirname, 'native', 'neo_windows.exe');
}
function runtimePath() {
  return app.isPackaged ? path.join(process.resourcesPath, 'neo_input_26.2.jar') :
    path.join(__dirname, 'runtime', 'mouse-mouse', 'build', 'libs', 'Mouse-mouse-Fabric-1.0.2+mc26.2.jar');
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
ipcMain.handle('neo:install-runtime', async () => {
  if (!existsSync(runtimePath())) throw new Error('The Minecraft 26.2 input mod is missing from this build.');
  const result = await dialog.showOpenDialog({
    title: 'Choose a Minecraft 26.2 game directory',
    properties: ['openDirectory', 'multiSelections'],
    defaultPath: path.join(app.getPath('appData'), '.minecraft')
  });
  if (result.canceled) return [];
  return result.filePaths.map(dir => {
    const mods = path.join(dir, 'mods');
    mkdirSync(mods, { recursive: true });
    const target = path.join(mods, 'neo-input-26.2.jar');
    copyFileSync(runtimePath(), target);
    return target;
  });
});
