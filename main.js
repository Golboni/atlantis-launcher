const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

let tray = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 460,
    height: 620,
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

  tray.setContextMenu(trayMenu);
});
