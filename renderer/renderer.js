console.log("Atlantis Launcher Renderer Loaded");

// Update status lights every 2 seconds
function updateStatus() {

  // -------------------------
  // IceBreakrz (port 3010)
  // -------------------------
  window.atlantis.checkPort(3010).then(isRunning => {
    document.getElementById('icebreakrz-status')
      .classList.toggle('running', isRunning);
  });

  // -------------------------
  // Pop Off (Metro Bundler, port 8081)
  // -------------------------
  window.atlantis.checkPort(8081).then(isRunning => {
    document.getElementById('popoff-status')
      .classList.toggle('running', isRunning);
  });

  // -------------------------
  // Command Center (Next.js, port 3000)
  // -------------------------
  window.atlantis.checkPort(3000).then(isRunning => {
    document.getElementById('command-status')
      .classList.toggle('running', isRunning);
  });

  // -------------------------
  // n8n (port 5678)
  // -------------------------
  window.atlantis.checkPort(5678).then(isRunning => {
    document.getElementById('n8n-status')
      .classList.toggle('running', isRunning);
  });

  // -------------------------
  // Docker Desktop (process-based)
  // -------------------------
  atlantis.checkStatus('docker.exe').then(isRunning => {
    document.getElementById('docker-status')
      .classList.toggle('running', isRunning);
  });

  // -------------------------
  // MkDocs (python or mkdocs)
  // -------------------------
  atlantis.checkStatus('mkdocs.exe').then(isRunning => {
    const dot = document.getElementById('mkdocs-status');
    if (isRunning) {
      dot.classList.add('running');
    } else {
      atlantis.checkStatus('python.exe').then(pyRunning => {
        dot.classList.toggle('running', pyRunning);
      });
    }
  });
}

// Start the loop
setInterval(updateStatus, 2000);
updateStatus();