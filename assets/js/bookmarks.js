// Bookmarks page specific functionality
function updateBookmarksDisplay() {
    const container = document.getElementById('bookmarks-container');
    container.innerHTML = '';
    
    if (bookmarks.length === 0) {
        container.innerHTML = '<p class="empty-state">You have no saved resources yet.</p>';
        return;
    }
    
    bookmarks.forEach(resource => {
        const card = createResourceCard(resource, true);
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateBookmarksDisplay();
    getLocation(); // Just to show location in header
});