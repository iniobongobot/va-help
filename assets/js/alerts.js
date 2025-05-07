// Alerts page specific functionality
function loadAlerts() {
    const container = document.getElementById('alerts-container');
    container.innerHTML = `
        <div class="resource-card">
            <h3>New Benefit Available</h3>
            <p>The VA has announced a new mental health initiative starting next month.</p>
            <span class="benefit-tag">Updated: 2 days ago</span>
        </div>
        <div class="resource-card">
            <h3>Job Fair in Your Area</h3>
            <p>Veteran-friendly employers will be at the ${currentLocation.split(',')[0]} Convention Center next week.</p>
            <span class="benefit-tag">Event: Next Tuesday</span>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', function() {
    loadAlerts();
    getLocation(); // Just to show location in header
});