const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('neo', {
  info: () => ipcRenderer.invoke('system:info'),
  pickNucleus: () => ipcRenderer.invoke('nucleus:pick'),
  launchNucleus: () => ipcRenderer.invoke('nucleus:launch'),
  openExternal: url => ipcRenderer.invoke('external:open', url)
});
