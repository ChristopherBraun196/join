const loginSignupSection = document.getElementById('login-signup-section');
const signupBtn = document.getElementById('signup');
const messageElement = document.getElementById('message-box');
const sidebar = document.getElementById('sidebar');
let addTaskDialog;

function init() {
    switchToLogin();
}

function generateDialog() {
    let main = document.querySelector('main');
    let dialogSection = document.createElement("dialog");
    dialogSection.id = "add-task-dialog";
    main.appendChild(dialogSection);
    addTaskDialog = dialogSection;
}

function switchToSignup() {
    loginSignupSection.innerHTML = getSignupTemplate();
    signupBtn.classList.add('hidden');
    document.title = "Join | Sign up";
}

function switchToLogin() {
    loginSignupSection.innerHTML = getLoginTemplate();
    signupBtn.classList.remove('hidden');
    document.title = "Join | Log in"
}

function showMessage(message) {
    messageElement.classList.add('visible');
    const msgNode = document.createElement('p');
    msgNode.textContent = message;
    messageElement.appendChild(msgNode);
    setTimeout(() => {
        msgNode.remove();
        if (messageElement.children.length === 0) {
            messageElement.classList.remove('visible');
        }
    }, 5000);
}

function signup() {
    showMessage("Signup Test")
}

function loadSidebar(page) {
    const map = {
        summary: ['active', '', '', '', '', ''],
        addtask: ['', 'active', '', '', '', ''],
        board:   ['', '', 'active', '', '', ''],
        contact: ['', '', '', 'active', '', ''],
        privacy: ['', '', '', '', 'active', ''],
        legal:   ['', '', '', '', '', 'active']
    }
    const args = map[page] || ['', '', '', '', '', '']
    sidebar.innerHTML = getSidebarTemplate(...args)
}

function openAddTaskDialog() {
    let main = document.querySelector('main');
    let dialogSection = document.createElement("dialog");
    dialogSection.id = "add-task-dialog";
    main.appendChild(dialogSection);
    dialogSection.innerHTML = getAddTaskDialogTemplate();
    dialogSection.showModal();
    addTaskDialog = dialogSection;
    renderContacts();
}

function closeAddTaskDialog() {
    addTaskDialog.close();
    addTaskDialog.remove();
}

function clearAddTaskForm() {
    
}

function setPriority(clickedButton) {
    const buttons = document.querySelectorAll('#task-priority-btns .priority');
    buttons.forEach(btn => {
        btn.classList.remove('set');
    });
    clickedButton.classList.add('set');
}


async function loadContacts() {
    return [
        { id: "xK9mP2qRtL8vNjW3", name: "David Eisenberg",  color: "#FFBB2B" },
        { id: "aB3cD4eF5gH6iJ7k", name: "David Müller",     color: "#FF5733" },
        { id: "cD5eF6gH7iJ8kL9m", name: "Sarah König",      color: "#29ABE2" },
        { id: "eF7gH8iJ9kL0mN1o", name: "Max Mustermann",   color: "#7AE229" },
        { id: "gH9iJ0kL1mN2oP3q", name: "Lisa Schneider",   color: "#C300C3" },
    ];
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

async function renderContacts() {
    const contacts = await loadContacts();
    const container = document.getElementById('custom-select-dropdown-inner');

    container.innerHTML = contacts.map(contact => `
        <div class="custom-option" 
             onclick="toggleContact(this)" 
             data-id="${contact.id}">
            <div class="contact-avatar" style="background:${contact.color}">
                ${getInitials(contact.name)}
            </div>
            <span>${contact.name}</span>
            <input type="checkbox">
        </div>
    `).join('');
}

function toggleDropdown(id) {
    const wrapper = document.getElementById(`${id}-wrapper`);
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const dropdown = document.getElementById(`${id}-dropdown`);

    const isOpen = dropdown.classList.contains('open');

    document.querySelectorAll('.custom-select-dropdown.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.custom-select-trigger.open').forEach(t => t.classList.remove('open'));

    if (!isOpen) {
        dropdown.classList.add('open');
        trigger.classList.add('open');
    }
}

function selectCategory(option) {
    document.querySelectorAll('#category-dropdown .custom-option').forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');

    const placeholder = document.getElementById('category-placeholder');
    placeholder.textContent = option.querySelector('span').textContent;
    placeholder.style.color = '#2a3647';

    toggleDropdown('category');
}

function toggleContact(option) {
    const checkbox = option.querySelector('input[type="checkbox"]');
    const isSelected = option.classList.toggle('selected');
    checkbox.checked = isSelected;
    updateAssignedBadges();
}

function updateAssignedBadges() {
    const badges = document.getElementById('assigned-badges');
    badges.innerHTML = '';

    document.querySelectorAll('#assigned-dropdown .custom-option.selected').forEach(opt => {
        const avatar = opt.querySelector('.contact-avatar');
        const badge = document.createElement('div');
        badge.className = 'badge-avatar';
        badge.style.background = avatar.style.background;
        badge.textContent = avatar.textContent;
        badges.appendChild(badge);
    });
}

function renderSelectedAvatars() {
    const container = document.getElementById('selected-avatars');
    if (!container) return;
    container.innerHTML = selectedContacts.map(c => `
        <div class="contact-avatar" style="background:${c.color}" title="${c.name}">
            ${getInitials(c.name)}
        </div>
    `).join('');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-wrapper')) {
        document.querySelectorAll('.custom-select-dropdown.open').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.custom-select-trigger.open').forEach(t => t.classList.remove('open'));
    }
});
