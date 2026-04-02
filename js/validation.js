/**
 * Validates a form field on blur and shows or clears the error message.
 * @param {HTMLElement} input - The input element to validate
 * @param {string} message - The error message to display if the field is empty
 */
function validateOnBlur(input, message = 'This field is required') {
    if (isFieldEmpty(input)) {
        showFieldError(input, message);
    } else {
        clearFieldError(input);
    }
}

/**
 * Validates all required fields in a form and returns whether the form is valid.
 * @param {HTMLFormElement} form - The form element to validate
 * @returns {boolean} True if all required fields are filled, false otherwise
 */
function validateForm(form) {
    const fields = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    fields.forEach(input => {
        const message = input.dataset.errorMsg || 'This field is required';
        if (isFieldEmpty(input)) {
            showFieldError(input, message);
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });

    return isValid;
}

/**
 * Checks whether an input field is empty.
 * @param {HTMLElement} input - The input element to check
 * @returns {boolean} True if the field is empty, false otherwise
 */
function isFieldEmpty(input) {
    return input.value.trim() === '';
}

/**
 * Displays an error message below the input field.
 * @param {HTMLElement} input - The input element to mark as invalid
 * @param {string} message - The error message to display
 */
function showFieldError(input, message) {
    input.classList.add('input-error');

    let errorEl = getErrorElement(input);
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error-msg';
        input.insertAdjacentElement('afterend', errorEl);
    }
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

/**
 * Clears the error state and hides the error message of an input field.
 * @param {HTMLElement} input - The input element to clear the error from
 */
function clearFieldError(input) {
    input.classList.remove('input-error');
    const errorEl = getErrorElement(input);
    if (errorEl) errorEl.style.display = 'none';
}

/**
 * Returns the error message element associated with an input field.
 * @param {HTMLElement} input - The input element to search from
 * @returns {HTMLElement|null} The error element or null if not found
 */
function getErrorElement(input) {
    const next = input.nextElementSibling;
    return next?.classList.contains('field-error-msg') ? next : null;
}