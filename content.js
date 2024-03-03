console.log('Content script is running.');

try {

    // Validation function for email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === '') {
            return 'Please enter email';
        }

        if (!emailRegex.test(email)) {
            return 'Invalid email format';
        }

        // Additional checks (customize as needed)
        const parts = email.split('@');
        const domain = parts[1];

        if (domain) {
            const domainParts = domain.split('.');
            if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
                return 'Invalid email domain';
            }
        }

        return null;
    }

    // Validation function for password
    function validatePassword(password) {
        // Additional checks (customize as needed)
        if (password === '') {
            return 'Please enter a value for this field';
        }

        if (password.length < 8) {
            return 'Password must be at least 8 characters';
        }

        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);

        if (!(hasUppercase && hasLowercase && hasDigit)) {
            return 'Password must contain at least one uppercase letter, one lowercase letter, and one digit';
        }

        // You can add more checks such as special characters if needed

        return null;
    }
    function validateCheckbox(input) {
        const customErrorMessage = 'Please agree to the terms and conditions';
        return input.checked ? null : customErrorMessage;
    }

    // Validation function for file input
    function validateFile(fileInput) {
        if (fileInput.files.length === 0) {
            return 'Please select a file to upload';
        }

        const allowedExtensions = ['jpg', 'jpeg', 'png']; // Add allowed file extensions
        const fileName = fileInput.files[0].name;
        const fileExtension = fileName.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            return 'Invalid file format. Please upload a JPG, JPEG, or PNG file';
        }

        return null;
    }

    // Validation function for radio button
    function validateRadio(radioButtons) {
        const allUnchecked = Array.from(radioButtons).every(radio => !radio.checked);
        return allUnchecked ? 'Please select a gender' : null;
    }

    // Validation function for range input
    function validateRange(rangeInput) {
        const minValue = parseInt(rangeInput.min);
        const maxValue = parseInt(rangeInput.max);
        const value = parseInt(rangeInput.value);

        if (isNaN(value) || value < minValue || value > maxValue) {
            return `Please enter a value between ${minValue} and ${maxValue}`;
        }

        return null;
    }

    // Validation function for search input
    function validateSearch(searchInput) {
        return searchInput.value.trim() !== '' ? null : 'Please enter a search query';
    }

    // Validation function for tel input
    function validateTel(telInput) {
        const telRegex = /^\d{10}$/; // Assuming a 10-digit phone number

        if (!telRegex.test(telInput.value)) {
            return 'Please enter a valid 10-digit phone number';
        }

        return null;
    }

    // Validation function for text input
    function validateText(text) {
        return text.trim() !== '' ? null : 'Please enter a value for this field';
    }

    // Validation function for textarea input
    function validateTextarea(text) {
        return text.trim() !== '' ? null : 'Please enter a value for this textarea';
    }

    // Validation function for number input
    function validateNumber(number) {
        const trimmedNumber = number.trim();

        if (trimmedNumber === '') {
            return 'Please enter a value for this number field';
        }

        const parsedNumber = parseFloat(trimmedNumber);

        if (isNaN(parsedNumber)) {
            return 'Please enter a valid number';
        }

        // Additional custom validation logic if needed

        return null;
    }

    // Function to add validation error to history
    function addToHistory(updatedHistory, serialNumber, title, type, value, errorMessage) {
        const existingEntryIndex = updatedHistory.findIndex(entry => entry.serialNumber === serialNumber);

        if (existingEntryIndex !== -1) {
            const existingEntry = updatedHistory[existingEntryIndex];
            existingEntry.errors.push({ type, value, message: errorMessage });
        } else {
            updatedHistory.push({
                serialNumber,
                title,
                errors: [{ type, value, message: errorMessage }]
            });
        }

    }



    function highlightError(input, errorMessage, errorContainerId, errorClass) {
        // Get or create the error container
        const errorContainer = document.getElementById(errorContainerId) || createErrorContainer(input, errorContainerId);

        // Remove existing error messages with the specified class
        const existingErrorMessages = input.parentNode.querySelectorAll(`.${errorClass}`);
        existingErrorMessages.forEach(errorElement => {
            errorElement.remove();
        });

        // Remove existing error messages
        errorContainer.innerHTML = '';

      
        // Create and append error message
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginBottom = '5px';
        errorElement.style.marginTop = '0px';
        errorElement.textContent = errorMessage;

        errorContainer.appendChild(errorElement);
    }

    // Helper function to create the error container if it doesn't exist
    function createErrorContainer(input, errorContainerId) {
        const errorContainer = document.createElement('div');
        errorContainer.id = errorContainerId;

        // Insert error container just after the input field
        input.insertAdjacentElement('afterend', errorContainer);

        return errorContainer;
    }


    function clearError(input, errorContainerId) {
     

        // Find and remove the error container
        const errorContainer = document.getElementById(errorContainerId);
        if (errorContainer) {
            errorContainer.remove();
        }
    }

    // Validation function for various input types
    function validateInput(input) {
        const type = input.type.toLowerCase();
        const value = (type === 'checkbox') ? input.checked : input.value.trim(); // Adjusted value for checkboxes

        switch (type) {
            case 'email':
                return validateEmail(value);

            case 'password':
                return validatePassword(value);

            case 'text':
                return validateText(value);

            case 'textarea':
                return validateTextarea(value);

            case 'number':
                return validateNumber(value);

            case 'checkbox':
                return validateCheckbox(input);

            case 'file':
                return validateFile(input);

            case 'radio':
                const radioButtons = document.querySelectorAll(`input[type="radio"][name="${input.name}"]`);
                return validateRadio(radioButtons);

            case 'range':
                return validateRange(input);

            case 'search':
                return validateSearch(input);

            case 'tel':
                return validateTel(input);

            default:
                return null; // No validation for other types
        }
    }



    // Function to validate the form
    function validateForm() {

        const inputFields = document.querySelectorAll('input, textarea');
        const pageTitle = document.URL;
        chrome.storage.local.get({ validationHistory: [] }, function (result) {
            const updatedHistory = result.validationHistory || [];

            // Find the last serial number
            const lastSerialNumber = updatedHistory.length > 0 ? updatedHistory[updatedHistory.length - 1].serialNumber : 0;
            const serialNumber = lastSerialNumber + 1;

            inputFields.forEach(input => {
                const errorMessage = validateInput(input);

                if (input.hasAttribute('required') || (errorMessage || input.value.trim() === '')) {
                    highlightError(input, errorMessage , `${input.type.toLowerCase()}-error-message`);
                    addToHistory(updatedHistory, serialNumber, pageTitle, input.type.toLowerCase(), input.value.trim(), errorMessage );
                    console.log(`Validation failure: Type - ${input.type.toLowerCase()}, Value - ${input.value.trim()}, Error - ${errorMessage }`);
                } else {
                    clearError(input, `${input.type.toLowerCase()}-error-message`);
                }
            });

            // Save the updated history
            chrome.storage.local.set({ validationHistory: updatedHistory }, function () {
            });
        });
    }

    // Listen for messages from the popup or background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'validateForm') {

            validateForm();
        }
    });
} catch (error) {
    console.error('Error executing content script:', error.message, error.stack);
}

