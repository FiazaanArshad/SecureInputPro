//background.js
console.log('background is running.');
try {
    chrome.runtime.onInstalled.addListener(() => {
        console.log('Form Validator extension installed');
    });
    
    chrome.action.onClicked.addListener((tab) => {
        try {
            chrome.tabs.executeScript(tab.id, { file: "content.js" });
        } catch (error) {
            console.error('Error executing content script:', error.message);
        }
    });
    
} catch (error) {
    console.error('Error executing content script:', error.message, error.stack);
}



