// Function to handle vulnerability findings
function handleVulnerability(tabId, vulnerabilityDetails) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Potential XSS Vulnerability Detected',
        message: `Vulnerability found in form: ${vulnerabilityDetails.formId}`
    });

    // Retrieve existing vulnerabilities from chrome.storage.local
    chrome.storage.local.get({ vulnerabilities: [] }, function(result) {
        const vulnerabilities = result.vulnerabilities;
        vulnerabilities.push({ tabId, ...vulnerabilityDetails });

        // Store the updated list of vulnerabilities back to chrome.storage.local
        chrome.storage.local.set({ vulnerabilities }, function() {
            console.log("Vulnerability added and stored in storage.");
        });
    });
}

// Function to clear reported vulnerabilities
function clearVulnerabilities() {
    // Clear vulnerabilities from chrome.storage.local
    chrome.storage.local.set({ vulnerabilities: [] }, function() {
        console.log("Vulnerabilities cleared from storage.");
    });
}

// Expose the function to content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "reportVulnerability" && sender.tab) {
        handleVulnerability(sender.tab.id, request.data);
    } else if (request.action === "clearVulnerabilities") {
        clearVulnerabilities();
    }
});
