const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const { ipcMain } = require('electron');
const net = require('net');   // <-- Added for port checking

let tray = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 480,
    height: 840,
    title: "Atlantis Apps Launcher",
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  win.loadFile('renderer/index.html');
}

app.whenReady().then(() => {
  createWindow();

  tray = new Tray(path.join(__dirname, 'icon.png'));
  tray.setToolTip('Atlantis Apps Launcher');

  const trayMenu = Menu.buildFromTemplate([
    { label: 'Open Atlantis Apps Launcher', click: createWindow },
    { label: 'Exit', click: () => app.quit() }
  ]);

  // -----------------------------
  // PROCESS STATUS CHECK HANDLER
  // -----------------------------
  ipcMain.handle('check-status', async (event, processName) => {
    return new Promise((resolve) => {
      exec(`tasklist`, (err, stdout) => {
        if (err) return resolve(false);
        resolve(stdout.toLowerCase().includes(processName.toLowerCase()));
      });
    });
  });

  // -----------------------------
  // PORT STATUS CHECK HANDLER
  // -----------------------------
  ipcMain.handle('check-port', async (event, port) => {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(500);

      socket.once('connect', () => {
        socket.destroy();
        resolve(true);
      });

      socket.once('timeout', () => {
        socket.destroy();
        resolve(false);
      });

      socket.once('error', () => {
        resolve(false);
      });

      socket.connect(port, '127.0.0.1');
    });
  });

  // -----------------------------
  // RUN COMMAND HANDLER
  // -----------------------------
  ipcMain.on('run-cmd', (event, cmd) => {
    exec(cmd);
  });

  tray.setContextMenu(trayMenu);
});
