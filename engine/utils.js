const fs = require('fs');
const path = require('path');

/**
 * Async delay helper
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Timestamped logging
 */
function log(...args) {
  const ts = new Date().toISOString();
  console.log(`[${ts}]`, ...args);
}

/**
 * Resolve a script path inside /scripts/
 */
function resolveScript(scriptName) {
  return path.join(__dirname, '..', 'scripts', scriptName);
}

/**
 * Check if a file exists safely
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

module.exports = {
  delay,
  log,
  resolveScript,
  fileExists
};
