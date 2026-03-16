console.log("Atlantis Launcher Renderer Loaded");

// Update status lights every 2 seconds
function updateStatus() {

  atlantis.checkStatus('icebreakrz.exe').then(isRunning => {
    document.getElementById('icebreakrz-status')
      .classList.toggle('running', isRunning);
  });

  atlantis.checkStatus('popoff.exe').then(isRunning => {
    document.getElementById('popoff-status')
      .classList.toggle('running', isRunning);
  });

  atlantis.checkStatus('command-center.exe').then(isRunning => {
    document.getElementById('command-status')
      .classList.toggle('running', isRunning);
  });

  atlantis.checkStatus('n8n.exe').then(isRunning => {
    document.getElementById('n8n-status')
      .classList.toggle('running', isRunning);
  });

  atlantis.checkStatus('docker.exe').then(isRunning => {
    document.getElementById('docker-status')
      .classList.toggle('running', isRunning);
  });

  // MkDocs runs as "python.exe" or "mkdocs.exe" depending on install
  // We check both to be safe
  atlantis.checkStatus('mkdocs.exe').then(isRunning => {
    const dot = document.getElementById('mkdocs-status');
    if (isRunning) {
      dot.classList.add('running');
    } else {
      // fallback: check python.exe (common for mkdocs serve)
      atlantis.checkStatus('python.exe').then(pyRunning => {
        dot.classList.toggle('running', pyRunning);
      });
    }
  });
}

// Start the loop
setInterval(updateStatus, 2000);
updateStatus();
