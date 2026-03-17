const path = require('path');
const { exec } = require('child_process');
const apps = require('../config/apps.json');

/**
 * Build an absolute path to a script in /scripts/
 */
function getScriptPath(scriptName) {
  return path.join(__dirname, '..', 'scripts', scriptName);
}

/**
 * Execute a batch file and return a Promise
 */
function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    const scriptPath = getScriptPath(scriptName);

    exec(`"${scriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running ${scriptName}:`, { code: error.code, stdout, stderr });
        reject({ code: error.code, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

/**
 * Start a single app
 */
async function startApp(appId) {
  const app = apps[appId];
  if (!app || !app.script) return;

  return runScript(app.script);
}

/**
 * Stop a single app
 */
async function stopApp(appId) {
  const app = apps[appId];
  if (!app || !app.stopScript) return;

  return runScript(app.stopScript);
}

/**
 * Restart a single app
 */
async function restartApp(appId) {
  await stopApp(appId);
  return startApp(appId);
}

/**
 * Start all apps in order
 */
async function startAll() {
  for (const id of Object.keys(apps)) {
    const app = apps[id];
    if (app.script) {
      await runScript(app.script).catch(() => {});
    }
  }
}

/**
 * Stop all apps in reverse order
 */
async function stopAll() {
  const ids = Object.keys(apps).reverse();
  for (const id of ids) {
    const app = apps[id];
    if (app.stopScript) {
      await runScript(app.stopScript).catch(() => {});
    }
  }
}

/**
 * Restart all apps
 */
async function restartAll() {
  await stopAll();
  return startAll();
}

module.exports = {
  startApp,
  stopApp,
  restartApp,
  startAll,
  stopAll,
  restartAll
};
