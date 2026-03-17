const fs = require('fs');
const path = require('path');
const http = require('http');
const net = require('net');
const apps = require('../config/apps.json');

let interval = null;

/**
 * Check if a port is open
 */
function checkPort(port) {
  return new Promise((resolve) => {
    if (!port) return resolve(false);

    const socket = new net.Socket();
    socket.setTimeout(800);

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
}

/**
 * Check if a health URL returns 200
 */
function checkHealth(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);

    const req = http.get(url, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Build the status object for all apps
 */
async function buildStatus() {
  const status = {};

  for (const id of Object.keys(apps)) {
    const app = apps[id];

    const portOpen = await checkPort(app.port);
    const healthy = app.health ? await checkHealth(app.health) : null;

    let state = 'stopped';

    if (portOpen && healthy === true) {
      state = 'healthy';
    } else if (portOpen && healthy === false) {
      state = 'running-unhealthy';
    } else {
      state = 'stopped';
    }

    status[id] = {
      status: state,
      portOpen,
      healthy
    };
  }

  return status;
}

/**
 * Write status.json every 2 seconds
 */
function startStatusWriter() {
  if (interval) return;

  interval = setInterval(async () => {
    const status = await buildStatus();
    const filePath = path.join(__dirname, '..', 'status.json');

    fs.writeFile(filePath, JSON.stringify(status, null, 2), () => {});
  }, 2000);
}

/**
 * Stop writing status.json
 */
function stopStatusWriter() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

module.exports = {
  startStatusWriter,
  stopStatusWriter
};
