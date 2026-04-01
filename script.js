const loginSignupSection = document.getElementById('login-signup-section');
const signupBtn = document.getElementById('signup');
const messageElement = document.getElementById('message-box');
const sidebar = document.getElementById('sidebar');

const animatedImgWrapper = document.getElementById('animated-img-wrapper');
const navLogo = document.getElementById('navbar-logo');

/**
 * Checks whether the current user is a guest.
 * @returns {boolean} True if the current user is a guest, false otherwise
 */

function isGuest() {
  return window.currentUser?.name === "Guest";
}

if (animatedImgWrapper) {
    animatedImgWrapper.addEventListener('animationend', (e) => {
        if (e.target === animatedImgWrapper) {
            animatedImgWrapper.style.display = 'none';
            navLogo.classList.remove("hide");
        }
    });    
}

/**
 * Initializes the page by generating the topbar and loading the sidebar.
 * @param {string} site - The current page identifier
 */

function init(site) {
    generateTopbar();
    loadSidebar(site);
}

/**
 * Creates and appends an empty add task dialog element to the main content area.
 */

function generateDialog() {
    let main = document.querySelector('main');
    let dialogSection = document.createElement("dialog");
    dialogSection.id = "add-task-dialog";
    main.appendChild(dialogSection);
    addTaskDialog = dialogSection;
}

/**
 * Creates and appends the topbar element to the body.
 */

function generateTopbar() {
    let body = document.querySelector('body');
    let header = document.createElement('header');
    header.id = 'topbar';
    body.appendChild(header);
    setTopbar();
}

/**
 * Renders the topbar template into the topbar element.
 */

function setTopbar() {
    const topbar = document.getElementById('topbar');
    topbar.innerHTML = getTopbarTemplate();
}

/**
 * Switches the login/signup section to the signup form.
 */

function switchToSignup() {
    loginSignupSection.innerHTML = getSignupTemplate();
    signupBtn.classList.add('hidden');
    document.title = "Join | Sign up";
}

/**
 * Switches the login/signup section to the login form.
 */

function switchToLogin() {
    loginSignupSection.innerHTML = getLoginTemplate();
    signupBtn.classList.remove('hidden');
    document.title = "Join | Log in"
}

/**
 * Displays a temporary message in the message box for 5 seconds.
 * @param {string} message - The message to display
 */

function showMessage(message) {
    messageElement.classList.add('visible');
    const msgNode = document.createElement('p');
    msgNode.textContent = message.toString();
    messageElement.appendChild(msgNode);
    setTimeout(() => {
        msgNode.remove();
        if (messageElement.children.length === 0) {
            messageElement.classList.remove('visible');
        }
    }, 5000);
}

/**
 * Loads the sidebar with the active navigation link for the given page.
 * @param {string} page - The current page identifier (e.g. "summary", "board")
 */

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

/**
 * Returns the initials of a full name.
 * @param {string} name - The full name to extract initials from
 * @returns {string} The uppercase initials
 */

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

/**
 * Renders the user menu with the current user's initials and avatar color.
 */

function renderUserMenue() {
    const user = window.currentUser;
    const um = document.getElementById("user-menue");
    if (!user) um.innerText = 'G';
    else {
        const initials = getInitials(user.name);
        um.style.backgroundColor = user.avatarColor;
        um.innerText = initials;
    }
    um.classList.add('show');
}

/**
 * Toggles the visibility of the user menu dropdown.
 */

function toggleUserMenue() {
    const dropdown = document.getElementById('user-menue-dropdown');
    dropdown.classList.toggle('show');
}