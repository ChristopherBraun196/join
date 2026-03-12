
function validateOnBlur(input, message = 'This field is required') {
    if (isFieldEmpty(input)) {
        showFieldError(input, message);
    } else {
        clearFieldError(input);
    }
}

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

function isFieldEmpty(input) {
    return input.value.trim() === '';
}

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

function clearFieldError(input) {
    input.classList.remove('input-error');
    const errorEl = getErrorElement(input);
    if (errorEl) errorEl.style.display = 'none';
}

function getErrorElement(input) {
    const next = input.nextElementSibling;
    return next?.classList.contains('field-error-msg') ? next : null;
}