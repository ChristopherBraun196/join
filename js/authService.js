import { auth, db } from "./firebaseAuth.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, signOut} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";


export const AVATAR_COLORS = [
  "#FF7043",
  "#E91E8C",
  "#9C27B0",
  "#3F51B5",
  "#00BCD4",
  "#4CAF50",
  "#FF9800",
  "#795548",
];

/**
 * Returns a randomly selected avatar color from the predefined color list.
 * @returns {string} A hex color code
 */
export function selectRandomAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

/**
 * Creates a contact entry in the database for a newly registered user.
 * @param {string} uid - The Firebase user ID
 * @param {string} name - The full name of the user
 * @param {string} email - The email address of the user
 * @returns {Promise<string>} The generated contact ID
 */
async function createContactEntry(uid, name, email) {
  const contactId = `contact-${generateUUID()}`;
  await set(ref(db, `contacts/${contactId}`), {
    id: contactId,
    name: name,
    email: email,
    avatarColor: selectRandomAvatarColor(),
    uid: uid,
  });
  return contactId;
}

/**
 * Creates a user entry in the database linking the user to their contact.
 * @param {string} uid - The Firebase user ID
 * @param {string} contactId - The associated contact ID
 * @returns {Promise<void>}
 */
async function createUserEntry(uid, contactId) {
  await set(ref(db, `users/${uid}`), {
    contactId: contactId,
  });
}

/**
 * Displays an error message at the relevant input field based on the Firebase signup error code.
 * @param {Error} error - The Firebase error object
 */
function handleSignupError(error) {
  const form = document.getElementById("login-signup-form");
  const emailInput = form.querySelector("input[name='email']");
  const passwordInput = form.querySelector("input[name='password']");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  const emailMessages = {
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email": "Invalid email address.",
  };
  const passwordMessages = {
    "auth/weak-password": "Password too weak (min. 6 characters).",
  };

  if (emailMessages[error.code]) {
    showFieldError(emailInput.closest(".email-input"), emailError, emailMessages[error.code]);
  } else if (passwordMessages[error.code]) {
    showFieldError(passwordInput.closest(".pwd-input"), passwordError, passwordMessages[error.code]);
  } else {
    showFieldError(emailInput.closest(".email-input"), emailError, error.message);
  }
}

/**
 * Registers a new user with email and password and redirects to the summary page.
 * @param {string} name - The full name of the user
 * @param {string} email - The email address of the user
 * @param {string} password - The password for the new account
 * @returns {Promise<void>}
 */
async function signup(name, email, password) {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const contactId = await createContactEntry(user.uid, name, email);
    await createUserEntry(user.uid, contactId);
    await signOut(auth);
    showMessage("Signup successful!");
    setTimeout(() => {
      switchToLogin();
    }, 1000);
  } catch (error) {
    handleSignupError(error);
  }
}

/**
 * Displays an error message at the relevant input field based on the Firebase login error code.
 * @param {Error} error - The Firebase error object
 */
function handleLoginError(error) {
  const form = document.getElementById("login-signup-form");
  const emailInput = form.querySelector("input[name='email']");
  const passwordInput = form.querySelector("input[name='password']");
  const passwordError = document.getElementById("password-error");

  if (error.code === "auth/too-many-requests") {
    showFieldError(passwordInput.closest(".pwd-input"), passwordError, "Too many failed attempts. Please wait a moment.");
    return;
  }

  emailInput.closest(".email-input").classList.add("invalid");
  showFieldError(passwordInput.closest(".pwd-input"), passwordError, "Wrong email address or password.");
}

/**
 * Signs in a user with email and password and redirects to the summary page.
 * @param {string} email - The email address of the user
 * @param {string} password - The user's password
 * @returns {Promise<void>}
 */
async function login(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    showMessage("Login successful!");
    setTimeout(() => {
      window.location.href = "./summary.html";
    }, 2000);
  } catch (error) {
    handleLoginError(error);
  }
}

/**
 * Shows a field error message and highlights the input border.
 * @param {HTMLElement} inputWrapper - The parent div of the input
 * @param {HTMLElement} errorEl - The error span element
 * @param {string} message - The error message to display
 */
function showFieldError(inputWrapper, errorEl, message) {
  inputWrapper.classList.add("invalid");
  errorEl.textContent = message;
  errorEl.classList.add("visible");
}

/**
 * Clears a field error message and removes the invalid border.
 * @param {HTMLElement} inputWrapper - The parent div of the input
 * @param {HTMLElement} errorEl - The error span element
 */
function clearFieldError(inputWrapper, errorEl) {
  inputWrapper.classList.remove("invalid");
  errorEl.textContent = "";
  errorEl.classList.remove("visible");
}

/**
 * Shows or hides the password visibility toggle button based on input content.
 * @param {HTMLInputElement} input - The password input element
 */
function togglePwdVisibilityBtn(input) {
  const wrapper = input.parentElement;
  const btn = wrapper.querySelector(".pwd-toggle-btn");
  const lock = wrapper.querySelector(".pwd-lock-icon");
  const hasValue = input.value.length > 0;
  if (btn) btn.classList.toggle("visible", hasValue);
  if (lock) lock.classList.toggle("hidden", hasValue);
}

/**
 * Toggles the password input between plain text and password type.
 * @param {HTMLButtonElement} btn - The toggle button element
 */
function togglePwdVisibility(btn) {
  const input = btn.parentElement.querySelector("input");
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  btn.classList.toggle("showing", isHidden);
}

/**
 * Validates a required field on blur and shows an error if empty.
 * @param {HTMLInputElement} input - The input element
 * @param {string} errorId - The ID of the error span
 */
function validateField(input, errorId) {
  const errorEl = document.getElementById(errorId);
  const wrapper = input.parentElement;
  if (!input.value.trim()) {
    showFieldError(wrapper, errorEl, "This field is required");
  } else {
    clearFieldError(wrapper, errorEl);
  }
}

/**
 * Validates the confirm password field on blur.
 * @param {HTMLInputElement} input - The confirm password input element
 */
function validatePasswordConfirm(input) {
  const errorEl = document.getElementById("password-confirm-error");
  const wrapper = input.parentElement;
  const form = document.getElementById("login-signup-form");
  const password = form.querySelector("input[name='password']").value;
  if (!input.value.trim()) {
    showFieldError(wrapper, errorEl, "This field is required");
  } else if (input.value !== password) {
    showFieldError(wrapper, errorEl, "Passwords do not match");
  } else {
    clearFieldError(wrapper, errorEl);
  }
}

/**
 * Reads the login form values and triggers the login process.
 * @param {Event} event - The form submit event
 * @returns {Promise<void>}
 */
async function handleLogin() {
  const form = document.getElementById("login-signup-form");
  const emailInput = form.querySelector("input[name='email']");
  const passwordInput = form.querySelector("input[name='password']");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  let valid = true;

  if (!emailInput.value.trim()) {
    showFieldError(emailInput.closest(".email-input"), emailError, "This field is required");
    valid = false;
  } else {
    clearFieldError(emailInput.closest(".email-input"), emailError);
  }

  if (!passwordInput.value.trim()) {
    showFieldError(passwordInput.closest(".pwd-input"), passwordError, "This field is required");
    valid = false;
  } else {
    clearFieldError(passwordInput.closest(".pwd-input"), passwordError);
  }

  if (!valid) return;
  await login(emailInput.value, passwordInput.value);
}

/**
 * Reads the signup form values and triggers the signup process.
 * @param {Event} event - The form submit event
 * @returns {Promise<void>}
 */
async function handleSignup() {
  const form = document.getElementById("login-signup-form");
  const nameInput = form.querySelector("input[name='fullname']");
  const emailInput = form.querySelector("input[name='email']");
  const passwordInput = form.querySelector("input[name='password']");
  const passwordConfirmInput = form.querySelector("input[name='password_confirm']");
  const acceptCheckbox = form.querySelector("#accept-btn");
  const fullnameError = document.getElementById("fullname-error");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const passwordConfirmError = document.getElementById("password-confirm-error");
  const acceptError = document.getElementById("accept-error");

  let valid = true;

  if (!nameInput.value.trim()) {
    showFieldError(nameInput.closest(".name-input"), fullnameError, "This field is required");
    valid = false;
  } else {
    clearFieldError(nameInput.closest(".name-input"), fullnameError);
  }

  if (!emailInput.value.trim()) {
    showFieldError(emailInput.closest(".email-input"), emailError, "This field is required");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(emailInput.value.trim())) {
    showFieldError(emailInput.closest(".email-input"), emailError, "Not a valid email address");
    valid = false;
  } else {
    clearFieldError(emailInput.closest(".email-input"), emailError);
  }

  if (!passwordInput.value.trim()) {
    showFieldError(passwordInput.closest(".pwd-input"), passwordError, "This field is required");
    valid = false;
  } else if (passwordInput.value.length < 6) {
    showFieldError(passwordInput.closest(".pwd-input"), passwordError, "Password too weak (min. 6 characters).");
    valid = false;
  } else {
    clearFieldError(passwordInput.closest(".pwd-input"), passwordError);
  }

  if (!passwordConfirmInput.value.trim()) {
    showFieldError(passwordConfirmInput.closest(".pwd-input"), passwordConfirmError, "This field is required");
    valid = false;
  } else if (passwordConfirmInput.value !== passwordInput.value) {
    showFieldError(passwordConfirmInput.closest(".pwd-input"), passwordConfirmError, "Passwords do not match");
    valid = false;
  } else {
    clearFieldError(passwordConfirmInput.closest(".pwd-input"), passwordConfirmError);
  }

  if (!acceptCheckbox.checked) {
    acceptCheckbox.classList.add("invalid");
    acceptError.textContent = "You have to accept the privacy policy";
    acceptError.classList.add("visible");
    valid = false;
  } else {
    acceptCheckbox.classList.remove("invalid");
    acceptError.textContent = "";
    acceptError.classList.remove("visible");
  }

  if (!valid) return;
  await signup(nameInput.value, emailInput.value, passwordInput.value);
}

/**
 * Signs in the user anonymously as a guest and redirects to the summary page.
 * @returns {Promise<void>}
 */
async function guestLogin() {
  try {
    await signInAnonymously(auth);
    window.location.href = "./summary.html";
  } catch (error) {
    showMessage("Gast-Login fehlgeschlagen: " + error.message);
  }
}

window.guestLogin = guestLogin;
window.signup = signup;
window.login = login;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.validateField = validateField;
window.validatePasswordConfirm = validatePasswordConfirm;
window.togglePwdVisibilityBtn = togglePwdVisibilityBtn;
window.togglePwdVisibility = togglePwdVisibility;
