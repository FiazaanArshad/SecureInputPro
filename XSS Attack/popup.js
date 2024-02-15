document.addEventListener('DOMContentLoaded', function() {
    // Function to display a status message
    function showStatusMessage(message) {
        const reportContainer = document.getElementById('report');
        reportContainer.innerHTML = `
            <div class="status-message">
                <img src="icons/search-icon.png" alt="Search" class="status-icon">
                <p>${message}</p>
            </div>
        `;
    }

    function showXSSVulnerabilityMessage() {
        const reportContainer = document.getElementById('report');
        reportContainer.innerHTML = `
            <div class="xss-vulnerability">
                <img src="icons/warning-icon.png" alt="Warning" class="status-icon">
                <p>XSS Vulnerability Detected: Breach!</p>
            </div>
        `;
    }

    function resetReport() {
        // Send a message to the background script to clear vulnerabilities
        chrome.runtime.sendMessage({ action: "clearVulnerabilities" });
    
        // Reset the UI to the initial searching state
        showStatusMessage("Searching for XSS vulnerabilities...");
    }

    // Call the function to show the initial searching message
    showStatusMessage("Searching for XSS vulnerabilities...");

    // Open the dashboard when the "Open Dashboard" button is clicked
    var dashboardButton = document.getElementById('dashboardButton');
    dashboardButton.addEventListener('click', function() {
        // Open a new tab with the dashboard page
        chrome.tabs.create({'url': chrome.runtime.getURL('dashboard.html')});
    });

    // Add event listener to the "Reset Report" button
    var resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', function() {
        resetReport(); // Reset the UI immediately
        // Send a message to the background script to clear vulnerabilities
        chrome.runtime.sendMessage({ action: "clearVulnerabilities" });
    });

    // Listen for messages from content scripts to update the UI when a breach is detected
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === "vulnerabilityDetected") {
            showXSSVulnerabilityMessage(); // Show the breach message
        }
    });
});
