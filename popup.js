console.log('popup.js is running.');
try {
    document.addEventListener('DOMContentLoaded', function () {
        // Declare validationHistory outside the event listener
        let validationHistory = [];

        // Function to populate the history dropdown
        function populateHistoryDropdown(validationHistory) {
            const historyDropdown = document.getElementById('historyDropdown');

            // Clear previous options
            historyDropdown.innerHTML = '';

            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.text = 'Select a page url';
            historyDropdown.add(defaultOption);

            // Populate dropdown with page titles and serial numbers
            validationHistory.forEach((entry) => {
                const option = document.createElement('option');
                option.value = entry.serialNumber + ". " + entry.title;
                option.text = `${entry.serialNumber}. ${entry.title}`; // Serial number + Page title         
                historyDropdown.add(option);
            });
        }

        // Function to display errors for the selected page
        function displayErrorsForPage(selectedPage, validationHistory) {
            const historyList = document.getElementById('historyList');
            historyList.style.display = 'flex'

            // Clear previous history
            historyList.innerHTML = '';

            // Display errors for the selected page
            validationHistory.forEach(entry => {
                if (entry.serialNumber + ". " + entry.title === selectedPage) {
                    const listItem = document.createElement('li');

                    // Create container for title and errors
                    const entryContainer = document.createElement('div');

                    // Title element
                    const titleItem = document.createElement('span');
                    titleItem.textContent = entry.serialNumber + ". " + entry.title;
                    entryContainer.appendChild(titleItem);

                    // Error list
                    const errorList = document.createElement('ul');
                    if (Array.isArray(entry.errors) && entry.errors.length > 0) {
                        entry.errors.forEach(error => {
                            const errorItem = document.createElement('li');
                            errorItem.textContent = `${error.type}: ${error.message}`;
                            errorList.appendChild(errorItem);
                        });
                        entryContainer.appendChild(errorList);
                    } else {
                        const errorItem = document.createElement('li');
                        errorItem.textContent = 'No errors found';
                        errorList.appendChild(errorItem);
                        entryContainer.appendChild(errorList);
                    }

                    // Append entry container to list item
                    listItem.appendChild(entryContainer);

                    // Append list item to history list
                    historyList.appendChild(listItem);
                }
                else {
                    historyList.style.display = 'flex'
                }
            });
        }



        // Function to update the dropdown
        function updateDropdown() {
            chrome.storage.local.get({ validationHistory: [] }, function (result) {
                const validationHistory = result.validationHistory;
                // Populate dropdown
                populateHistoryDropdown(validationHistory);
                document.getElementById('historyDropdown').addEventListener('change', function () {
                    const selectedPage = this.value;
                    displayErrorsForPage(selectedPage, validationHistory);

                });

            });
        }

        // Function to handle dropdown change
        function onDropdownChange() {
            try {
                const selectedPage = this.value;
                displayErrorsForPage(selectedPage, validationHistory);


            } catch (error) {
                console.error('Error OnDropDown Chnage:', error.message);

            }

        }

        // Initial update on page load
        updateDropdown();

        // Listen for changes in the dropdown selection
        document.getElementById('historyDropdown').addEventListener('change', onDropdownChange);

        // Listen for changes in validation history
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            if (namespace === 'local' && 'validationHistory' in changes) {
                // Update dropdown when validation history changes
                updateDropdown();
            }
        });

        // Function to validate the form
        function validateForm() {
            try {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    if (tabs && tabs.length > 0) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: 'validateForm' });

                    } else {
                        throw new Error('No active tabs found.');
                    }

                });
            } catch (error) {
                console.error('Error validating form:', error.message);
            }
        }

        // Attach the validateForm function to the validateButton click event
        const validateButton = document.getElementById('validateButton');
        validateButton.addEventListener('click', validateForm);

        // Handle clear history button click
        const clearHistoryButton = document.getElementById('clearHistoryButton');
        const snackbar = document.getElementById('snackbar');

        clearHistoryButton.addEventListener('click', function () {
            chrome.storage.local.remove('validationHistory', function () {
                console.log('History Cleared...');
                // After clearing, show the snackbar
                showSnackbar('History Cleared...', 'green');
                // Clear the selected value in the history dropdown
                updateDropdown();

                const historyList = document.getElementById('historyList');
                // Clear previous history
                historyList.innerHTML = '';
                // You may want to update the displayed history here
            });
        });

        // Function to show the snackbar
        function showSnackbar(message, color) {
            snackbar.textContent = message;
            snackbar.style.backgroundColor = color;
            snackbar.classList.add('show');

            // Hide the snackbar after 3 seconds (adjust as needed)
            setTimeout(function () {
                snackbar.classList.remove('show');
            }, 3000);
        }


        // Assuming you have a function to perform validation, let's call it validateForm
        function validateInput() {
            try {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    if (tabs && tabs.length > 0) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: 'validateForm' });
                    } else {
                        throw new Error('No active tabs found.');
                    }
                });
            } catch (error) {
                console.error('Error validating form:', error.message);
            }
        }

        // Attach the validateInput function to the validateButton click event
        const validateInputs = document.getElementById('validateInputs');
        validateInputs.addEventListener('click', validateInput);

        // JavaScript code to handle visibility toggling
        document.getElementById('dashboard').addEventListener('click', function () {
            document.getElementById('headerTitle').innerText = 'Dashboard';
            document.querySelector('.main-section').style.display = 'none';
            document.querySelector('.dashboard-section').style.display = 'flex';
            document.querySelector('.footer-main').style.display = 'none';
            document.querySelector('.footer-dashboard').style.display = 'flex';
            document.getElementById('backButton').style.display = 'flex'; // Use getElementById here
        });

        // Assuming you have a back button with id 'backButton'
        document.getElementById('backButton').addEventListener('click', function () {
            try {
                document.getElementById('headerTitle').innerText = 'Secure Input Pro';
                document.querySelector('.dashboard-section').style.display = 'none';
                document.querySelector('.main-section').style.display = 'flex';
                document.querySelector('.footer-main').style.display = 'flex';
                document.querySelector('.footer-dashboard').style.display = 'none';
                document.getElementById('backButton').style.display = 'none'; // Use getElementById here
            } catch (error) {
                console.error('Error handling back button click:', error.message);
            }
        });

        // Function to toggle dropdown visibility
        function toggleDropdown() {
            const dropdownList = document.getElementById('historyDropdown');
            if (dropdownList.style.display === 'flex') {
                dropdownList.style.display = 'none'
                document.getElementById('infoBtn').innerText = 'Info'
                document.getElementById('historyList').style.display = 'none'
            }
            else {
                dropdownList.style.display = 'flex'
                document.getElementById('infoBtn').innerText = 'Hide'
                document.getElementById('historyList').style.display = 'flex'
            }

        }

        // Add event listener to the infoBtn button
        const infoBtn = document.getElementById('infoBtn');
        infoBtn.addEventListener('click', toggleDropdown);

    });
} catch (error) {
    console.error('Error executing content script:', error.message, error.stack);
}

