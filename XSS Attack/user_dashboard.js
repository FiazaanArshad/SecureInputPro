document.addEventListener('DOMContentLoaded', function() {
    // Function to populate the user dashboard with vulnerability data
    function populateUserDashboard() {
        const vulnerabilitiesList = document.getElementById('vulnerabilitiesList');
        
        // Retrieve vulnerabilities data from storage
        chrome.storage.local.get({ vulnerabilities: [] }, function(result) {
            const vulnerabilities = result.vulnerabilities;
            
            // Populate the list with detected vulnerabilities
            vulnerabilities.forEach(function(vulnerability) {
                const listItem = document.createElement('li');
                listItem.textContent = `Form ID: ${vulnerability.formId}, Details: ${vulnerability.details}`;
                vulnerabilitiesList.appendChild(listItem);
            });
        });
    }

    // Call the function to populate the user dashboard
    populateUserDashboard();
});
