const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('neo', {
  info: () => ipcRenderer.invoke('system:info'),
  devices: () => ipcRenderer.invoke('neo:devices'),
  windows: () => ipcRenderer.invoke('neo:windows'),
  layout: orientation => ipcRenderer.invoke('neo:layout', orientation),
  installRuntime: () => ipcRenderer.invoke('neo:install-runtime')
});
