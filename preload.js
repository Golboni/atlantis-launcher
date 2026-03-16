const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('atlantis', {
  run: (cmd) => ipcRenderer.send('run-cmd', cmd),
  checkStatus: (processName) => ipcRenderer.invoke('check-status', processName)
});