function openContactDialog() {
    document.getElementById('dialog-overlay').classList.add('active');
}

function closeContactDialog() {
    document.getElementById('dialog-overlay').classList.remove('active');
    document.getElementById('input-name').value = '';
    document.getElementById('input-email').value = '';
    document.getElementById('input-phone').value = '';
}

function submitContact() {
    var data = {
        name: document.getElementById('input-name').value.trim(),
        email: document.getElementById('input-email').value.trim(),
        phone: document.getElementById('input-phone').value.trim(),
    };
    console.log('Neuer Kontakt:', data);
    closeContactDialog();
}

// schließt Dialog
document.getElementById('dialog-overlay').addEventListener('click', function (e) {
    if (e.target === this) closeContactDialog();
});