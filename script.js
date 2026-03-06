const loginSignupSection = document.getElementById('login-signup-section');
const signupBtn = document.getElementById('signup');
const messageElement = document.getElementById('message-box');
const sidebar = document.getElementById('sidebar');

function init() {
    switchToLogin();
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