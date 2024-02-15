// Function to find forms and test for vulnerabilities
function findFormsAndTest() {
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
        // Simplified example: testing if a form contains an input field susceptible to XSS
        const vulnerableInput = form.querySelector('input[type="text"]');
        if (vulnerableInput) {
            // Report this vulnerability to the background script
            chrome.runtime.sendMessage({
                action: "reportVulnerability",
                data: {
                    formId: `form-${index}`,
                    details: "Form contains a text input that might be vulnerable to XSS."
                }
            });
        }
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "clearVulnerabilities") {
        // Clear vulnerabilities here (for example, by removing any stored data)
        // You may need to adjust this part based on how you store vulnerabilities.
        console.log("Vulnerabilities cleared.");
    }
});
findFormsAndTest();
