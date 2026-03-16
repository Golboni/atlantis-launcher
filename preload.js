const { contextBridge, shell } = require('electron');
const path = require('path');

contextBridge.exposeInMainWorld('atlantis', {
  run: (script) => {
    const fullPath = path.join(__dirname, 'scripts', script);
    shell.openPath(fullPath);
  }
});
