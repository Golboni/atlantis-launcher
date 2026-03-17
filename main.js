const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const {
  startApp,
  stopApp,
  restartApp,
  startAll,
  stopAll,
  restartAll
} = require('./engine/orchestrator');

const { startStatusWriter, stopStatusWriter } = require('./engine/status-writer');

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('./renderer/index.html');
}

app.whenReady().then(() => {
  createWindow();
  startStatusWriter(); // begin writing status.json every 2s
});

app.on('window-all-closed', () => {
  stopStatusWriter();
  if (process.platform !== 'darwin') app.quit();
});

/* IPC COMMANDS FROM UI */
ipcMain.handle('start-app', (_, appId) => startApp(appId));
ipcMain.handle('stop-app', (_, appId) => stopApp(appId));
ipcMain.handle('restart-app', (_, appId) => restartApp(appId));

ipcMain.handle('start-all', () => startAll());
ipcMain.handle('stop-all', () => stopAll());
ipcMain.handle('restart-all', () => restartAll());
