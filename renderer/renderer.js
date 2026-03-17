window.addEventListener('DOMContentLoaded', () => {
  const updateUI = () => {
    fetch('status.json')
      .then(res => res.json())
      .then(status => {
        Object.keys(status).forEach(id => {
          const dot = document.getElementById(`${id}-status`);
          if (!dot) return;

	  console.log("Fetching status.json...");
          const state = status[id].status;

          if (state === 'healthy') {
            dot.style.background = '#00ff00';
          } else if (state === 'running-unhealthy') {
            dot.style.background = '#ffff00';
          } else if (state === 'stopped') {
            dot.style.background = '#ff0000';
          } else {
            dot.style.background = 'gray';
          }
        });
      })
      .catch(() => {
        // If status.json isn't ready yet, keep dots gray
      });
  };

  setInterval(updateUI, 1500);
});
