const http = require('http');
const net = require('net');

/**
 * Check if a port is open on localhost
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
 * Check if a health URL returns HTTP 200
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

module.exports = {
  checkPort,
  checkHealth
};
