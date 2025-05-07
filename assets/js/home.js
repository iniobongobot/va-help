// Home page specific functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Get location and load resources
    await getLocation();
    await loadSampleData();
    displayResourcesForLocation();
    
    // Set up tab filtering
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            filterResources(category);
        });
    });
    
    // Set up search
    document.getElementById('searchInput').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const cards = document.querySelectorAll('.resource-card');
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });
});

// Display resources for current location
function displayResourcesForLocation() {
    const container = document.getElementById('resources-container');
    container.innerHTML = '';
    
    // Filter resources by location
    let filteredResources = resourcesData.filter(resource => 
        !currentLocation || currentLocation === "National" || 
        (resource.Location && resource.Location.includes(currentLocation.split(',')[0])));
    
    if (filteredResources.length === 0) {
        filteredResources = resourcesData; // Fallback to all resources
    }
    
    // Group by category
    const groupedResources = {};
    filteredResources.forEach(resource => {
        const group = resource.Group || 'other';
        if (!groupedResources[group]) {
            groupedResources[group] = [];
        }
        groupedResources[group].push(resource);
    });
    
    // Display by category
    for (const [group, resources] of Object.entries(groupedResources)) {
        const sectionTitle = document.createElement('div');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = group.charAt(0).toUpperCase() + group.slice(1);
        container.appendChild(sectionTitle);
        
        resources.forEach(resource => {
            const isBookmarked = bookmarks.some(b => b['Resource Name'] === resource['Resource Name']);
            const card = createResourceCard(resource, isBookmarked);
            container.appendChild(card);
        });
    }
}

// Filter resources by category
function filterResources(category) {
    const container = document.getElementById('resources-container');
    container.innerHTML = '';
    
    const filteredResources = resourcesData.filter(resource => 
        (!currentLocation || currentLocation === "National" || 
        (resource.Location && resource.Location.includes(currentLocation.split(',')[0]))) &&
        (category === 'all' || (resource.Group && resource.Group === category)));
    
    if (filteredResources.length === 0) {
        container.innerHTML = '<p class="empty-state">No resources found in this category for your location.</p>';
        return;
    }
    
    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'section-title';
    sectionTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    container.appendChild(sectionTitle);
    
    filteredResources.forEach(resource => {
        const isBookmarked = bookmarks.some(b => b['Resource Name'] === resource['Resource Name']);
        const card = createResourceCard(resource, isBookmarked);
        container.appendChild(card);
    });
}