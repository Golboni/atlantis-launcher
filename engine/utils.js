const { exec } = require('child_process');
const net = require('net');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'apps.json');
const STATUS_PATH = path.join(__dirname, '..', 'status.json');

function loadConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
  return JSON.parse(raw);
}

function execCommand(command) {
  return new Promise((resolve, reject) => {
    if (!command) return resolve({ code: 0, stdout: '', stderr: '' });
    exec(command, (error, stdout, stderr) => {
      if (error) return reject({ code: error.code, stdout, stderr });
      resolve({ code: 0, stdout, stderr });
    });
  });
}

function waitForPort(port, timeoutMs = 30000, intervalMs = 500) {
  if (!port) return Promise.resolve(true);
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const socket = new net.Socket();
      socket.setTimeout(2000);
      socket.once('connect', () => {
        socket.destroy();
        resolve(true);
      });
      socket.once('error', () => {
        socket.destroy();
        if (Date.now() - start > timeoutMs) return reject(new Error('Port timeout'));
        setTimeout(check, intervalMs);
      });
      socket.once('timeout', () => {
        socket.destroy();
        if (Date.now() - start > timeoutMs) return reject(new Error('Port timeout'));
        setTimeout(check, intervalMs);
      });
      socket.connect(port, '127.0.0.1');
    };
    check();
  });
}

function waitForPortClose(port, timeoutMs = 30000, intervalMs = 500) {
  if (!port) return Promise.resolve(true);
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const socket = new net.Socket();
      socket.setTimeout(2000);
      socket.once('connect', () => {
        socket.destroy();
        if (Date.now() - start > timeoutMs) return reject(new Error('Port close timeout'));
        setTimeout(check, intervalMs);
      });
      socket.once('error', () => {
        socket.destroy();
        resolve(true);
      });
      socket.once('timeout', () => {
        socket.destroy();
        if (Date.now() - start > timeoutMs) return reject(new Error('Port close timeout'));
        setTimeout(check, intervalMs);
      });
      socket.connect(port, '127.0.0.1');
    };
    check();
  });
}

function writeStatus(statusObj) {
  fs.writeFileSync(STATUS_PATH, JSON.stringify(statusObj, null, 2), 'utf-8');
}

module.exports = {
  loadConfig,
  execCommand,
  waitForPort,
  waitForPortClose,
  writeStatus,
  STATUS_PATH
};
