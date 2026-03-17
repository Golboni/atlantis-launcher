const { writeStatus } = require('./utils');
const { getAllStatuses } = require('./health');

let intervalHandle = null;

async function updateStatusOnce() {
  const statuses = await getAllStatuses();
  writeStatus(statuses);
}

function startStatusWriter(intervalMs = 2000) {
  if (intervalHandle) return;
  updateStatusOnce();
  intervalHandle = setInterval(updateStatusOnce, intervalMs);
}

function stopStatusWriter() {
  if (!intervalHandle) return;
  clearInterval(intervalHandle);
  intervalHandle = null;
}

module.exports = {
  startStatusWriter,
  stopStatusWriter,
  updateStatusOnce
};
