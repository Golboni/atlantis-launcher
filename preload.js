const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("atlantis", {
  run: (scriptName) => ipcRenderer.invoke("run-script", scriptName),
  checkStatus: (processName) => ipcRenderer.invoke("check-status", processName),
  checkPort: (port) => ipcRenderer.invoke("check-port", port)
});
