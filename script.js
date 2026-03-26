const loginSignupSection = document.getElementById('login-signup-section');
const signupBtn = document.getElementById('signup');
const messageElement = document.getElementById('message-box');
const sidebar = document.getElementById('sidebar');

const animatedImgWrapper = document.getElementById('animated-img-wrapper');
const navLogo = document.getElementById('navbar-logo');


if (animatedImgWrapper) {
    animatedImgWrapper.addEventListener('animationend', (e) => {
        if (e.target === animatedImgWrapper) {
            animatedImgWrapper.style.display = 'none';
            navLogo.classList.remove("hide");
        }
    });    
}

function init(site) {
    generateTopbar();
    loadSidebar(site);
}

function generateDialog() {
    let main = document.querySelector('main');
    let dialogSection = document.createElement("dialog");
    dialogSection.id = "add-task-dialog";
    main.appendChild(dialogSection);
    addTaskDialog = dialogSection;
}

function generateTopbar() {
    let body = document.querySelector('body');
    let header = document.createElement('header');
    header.id = 'topbar';
    body.appendChild(header);
    setTopbar();
}

function setTopbar() {
    const topbar = document.getElementById('topbar');
    topbar.innerHTML = getTopbarTemplate();
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
    msgNode.textContent = message.toString();
    messageElement.appendChild(msgNode);
    setTimeout(() => {
        msgNode.remove();
        if (messageElement.children.length === 0) {
            messageElement.classList.remove('visible');
        }
    }, 5000);
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

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

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

function toggleUserMenue() {
    const dropdown = document.getElementById('user-menue-dropdown');
    dropdown.classList.toggle('show');
}