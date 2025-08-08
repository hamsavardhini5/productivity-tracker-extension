
// Script for dashboard UI
function msToTime(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

function renderDashboard(siteTimes) {
  const dashboard = document.getElementById('dashboard');
  if (!siteTimes || Object.keys(siteTimes).length === 0) {
    dashboard.innerHTML = '<p>No data tracked yet.</p>';
    return;
  }
  let html = '<table style="width:100%"><tr><th>Website</th><th>Time Spent</th></tr>';
  for (const [site, ms] of Object.entries(siteTimes)) {
    html += `<tr><td>${site}</td><td>${msToTime(ms)}</td></tr>`;
  }
  html += '</table>';
  dashboard.innerHTML = html;
}

// Request site times from background
chrome.runtime.sendMessage({type: 'GET_SITE_TIMES'}, (res) => {
  renderDashboard(res.siteTimes);
});
