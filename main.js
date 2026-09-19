const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const { existsSync, readFileSync, writeFileSync, mkdirSync } = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const settingsDir = path.join(app.getPath('userData'));
const settingsFile = path.join(settingsDir, 'settings.json');
const allowedUrls = new Set([
  'https://github.com/SplitScreen-Me/splitscreenme-nucleus/releases',
  'https://www.splitscreen.me/docs/proto/',
  'https://www.splitscreen.me/docs/faq/',
  'https://nucleuscoop.org/games/minecraft/'
]);
function readSettings() {
  try { return JSON.parse(readFileSync(settingsFile, 'utf8')); } catch { return {}; }
}
function saveSettings(data) {
  mkdirSync(settingsDir, { recursive: true });
  writeFileSync(settingsFile, JSON.stringify(data, null, 2));
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

ipcMain.handle('system:info', () => ({
  platform: process.platform,
  windowsVersion: os.release(),
  minecraftDirFound: existsSync(path.join(app.getPath('appData'), '.minecraft')),
  settings: readSettings()
}));
ipcMain.handle('nucleus:pick', async () => {
  const result = await dialog.showOpenDialog({ title: 'Select NucleusCoop.exe', properties: ['openFile'], filters: [{ name: 'Executable', extensions: ['exe'] }] });
  if (result.canceled) return null;
  const selected = result.filePaths[0];
  if (path.basename(selected).toLowerCase() !== 'nucleuscoop.exe') throw new Error('Select the NucleusCoop.exe file from the official Nucleus Co-op installation.');
  const settings = { ...readSettings(), nucleusPath: selected };
  saveSettings(settings);
  return selected;
});
ipcMain.handle('nucleus:launch', async () => {
  const selected = readSettings().nucleusPath;
  if (!selected || !existsSync(selected)) throw new Error('Select an existing NucleusCoop.exe first.');
  if (path.basename(selected).toLowerCase() !== 'nucleuscoop.exe') throw new Error('Configured file is not NucleusCoop.exe.');
  const child = spawn(selected, [], { cwd: path.dirname(selected), detached: true, stdio: 'ignore' });
  child.unref();
  return true;
});
ipcMain.handle('external:open', async (_event, url) => {
  if (!allowedUrls.has(url)) throw new Error('Unrecognized link.');
  await shell.openExternal(url);
});
