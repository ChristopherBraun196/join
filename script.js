const loginSignupSection = document.getElementById('login-signup-section');
const signupBtn = document.getElementById('signup');

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