// Shared functions and variables
let currentLocation = '';
let resourcesData = [];
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || null;

// Helper function to escape HTML
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Create a resource card element
function createResourceCard(resource, isBookmarked = false) {
    const card = document.createElement('div');
    card.className = 'resource-card';
    
    let html = `
        <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                onclick="toggleBookmark(this, '${escapeHtml(JSON.stringify(resource))}')">
            <i class="fas fa-bookmark"></i>
        </button>
        <h3>${escapeHtml(resource['Resource Name'])}</h3>
        <p>${escapeHtml(resource['Resource Summary'])}</p>
        <div class="contact-info">
    `;
    
    if (resource['Resource Address']) {
        html += `
            <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${escapeHtml(resource['Resource Address'])}</span>
            </div>
        `;
    }
    
    if (resource['Resource Phone']) {
        html += `
            <div class="contact-item">
                <i class="fas fa-phone"></i>
                <span>${escapeHtml(resource['Resource Phone'])}</span>
            </div>
        `;
    }
    
    if (resource['Resource Link']) {
        html += `
            <div class="contact-item">
                <i class="fas fa-globe"></i>
                <span><a href="${escapeHtml(resource['Resource Link'])}" target="_blank" style="color: var(--primary);">Visit Website</a></span>
            </div>
        `;
    }
    
    html += `</div>`;
    card.innerHTML = html;
    return card;
}

// Toggle bookmark
function toggleBookmark(button, resourceStr) {
    const resource = JSON.parse(resourceStr);
    const index = bookmarks.findIndex(b => b['Resource Name'] === resource['Resource Name']);
    
    if (index === -1) {
        bookmarks.push(resource);
        button.classList.add('bookmarked');
    } else {
        bookmarks.splice(index, 1);
        button.classList.remove('bookmarked');
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    if (typeof updateBookmarksDisplay === 'function') {
        updateBookmarksDisplay();
    }
}

// Load sample data
async function loadSampleData() {
    resourcesData = [
        {
            "Location": "Raleigh, NC",
            "Group": "benefits",
            "Resource Name": "NC State Veterans Home",
            "Resource Summary": "State-run facility providing long-term care for veterans",
            "Resource Link": "https://www.ncdhhs.gov/divisions/veterans-homes",
            "Resource Address": "924 NE 7th St, Raleigh, NC 27607",
            "Resource Phone": "(919) 733-6400"
        },
        {
            "Location": "Raleigh, NC",
            "Group": "education",
            "Resource Name": "Wake Technical Community College",
            "Resource Summary": "Dedicated support for veterans using GI Bill® benefits",
            "Resource Link": "https://www.waketech.edu",
            "Resource Address": "9101 Fayetteville Rd, Raleigh, NC 27603",
            "Resource Phone": "(919) 866-5000"
        },
        {
            "Location": "Raleigh, NC",
            "Group": "financial",
            "Resource Name": "Operation Homefront",
            "Resource Summary": "Provides critical financial assistance for veterans",
            "Resource Link": "https://www.operationhomefront.org",
            "Resource Address": "",
            "Resource Phone": "(800) 722-6098"
        }
    ];
}

// Get user location
async function getLocation() {
    const locationDisplay = document.getElementById('locationDisplay');
    
    try {
        // Get user's location
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        // Reverse geocoding to get city name
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
        const locationData = await response.json();
        const city = locationData.address.city || locationData.address.town || locationData.address.village;
        const state = locationData.address.state;
        currentLocation = `${city}, ${state}`;
        
        locationDisplay.innerHTML = `<i class="fas fa-map-marker-alt"></i><span>${currentLocation}</span>`;
        return currentLocation;
    } catch (error) {
        console.error("Error getting location:", error);
        currentLocation = "National";
        locationDisplay.innerHTML = `<i class="fas fa-map-marker-alt"></i><span>National Resources</span>`;
        return currentLocation;
    }
}

// Update user display
function updateUserDisplay() {
    const usernameElement = document.getElementById('username');
    const container = document.getElementById('account-info');
    const loginBtn = document.getElementById('login-btn');
    
    if (usernameElement) {
        usernameElement.textContent = userProfile ? userProfile.name.split(' ')[0] : 'Guest';
    }
    
    if (container && loginBtn) {
        if (userProfile) {
            container.innerHTML = `
                <p><strong>Name:</strong> ${escapeHtml(userProfile.name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(userProfile.email)}</p>
                <p><strong>Military Branch:</strong> ${escapeHtml(userProfile.branch || 'Not specified')}</p>
            `;
            loginBtn.textContent = 'Sign Out';
            loginBtn.onclick = signOut;
        } else {
            container.innerHTML = '<p>Sign in to access personalized features.</p>';
            loginBtn.textContent = 'Sign In with ID.me';
            loginBtn.onclick = signIn;
        }
    }
}

// Simulate sign in
function signIn() {
    userProfile = {
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        branch: "U.S. Army"
    };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    updateUserDisplay();
}

// Simulate sign out
function signOut() {
    userProfile = null;
    localStorage.removeItem('userProfile');
    updateUserDisplay();
}

// Initialize common elements
function initCommon() {
    // Back to top button
    window.addEventListener('scroll', function() {
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            backToTop.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
        }
    });
    
    // Update user display
    updateUserDisplay();
    
    // Load sample data
    loadSampleData();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initCommon);