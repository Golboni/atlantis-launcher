const http = require('http');
const net = require('net');
const { loadConfig } = require('./utils');

function checkPort(port) {
  if (!port) return Promise.resolve(false);
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
}

function checkHealthUrl(url) {
  if (!url) return Promise.resolve(false);
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function getAppStatus(appId) {
  const config = loadConfig();
  const app = config[appId];
  if (!app) return { status: 'unknown', port: null, lastCheck: Date.now() };

  const portOpen = await checkPort(app.port);
  if (!portOpen) {
    return {
      status: 'stopped',
      port: app.port,
      lastCheck: Date.now()
    };
  }

  const healthy = await checkHealthUrl(app.health);
  return {
    status: healthy ? 'healthy' : 'running-unhealthy',
    port: app.port,
    lastCheck: Date.now()
  };
}

async function getAllStatuses() {
  const config = loadConfig();
  const ids = Object.keys(config);
  const result = {};
  for (const id of ids) {
    result[id] = await getAppStatus(id);
  }
  return result;
}

module.exports = {
  checkPort,
  checkHealthUrl,
  getAppStatus,
  getAllStatuses
};
