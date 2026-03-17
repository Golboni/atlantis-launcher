const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('atlantis', {
  start: (id) => ipcRenderer.invoke('start-app', id),
  stop: (id) => ipcRenderer.invoke('stop-app', id),
  restart: (id) => ipcRenderer.invoke('restart-app', id),

  startAll: () => ipcRenderer.invoke('start-all'),
  stopAll: () => ipcRenderer.invoke('stop-all'),
  restartAll: () => ipcRenderer.invoke('restart-all')
});
