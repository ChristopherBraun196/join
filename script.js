const loginSignupSection = document.getElementById('login-signup-section');
const signupBtn = document.getElementById('signup');

function init() {
    
}

function switchToSignup() {
    loginSignupSection.innerHTML = getSignupTemplate();
    signupBtn.classList.add('hidden');
}

function switchToLogin() {
    loginSignupSection.innerHTML = getLoginTemplate();
    signupBtn.classList.remove('hidden');
}