import { auth, db } from "./firebaseAuth.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, signInAnonymously} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
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
 * Displays an error message based on the Firebase signup error code.
 * @param {Error} error - The Firebase error object
 */
function handleSignupError(error) {
  const messages = {
    "auth/email-already-in-use": "Diese E-Mail ist bereits registriert.",
    "auth/invalid-email": "Ungültige E-Mail-Adresse.",
    "auth/weak-password": "Passwort zu schwach (min. 6 Zeichen).",
  };
  showMessage(messages[error.code] || "Anderer Fehler: " + error.message);
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
    showMessage("Signup erfolgreich!");
    setTimeout(() => {
      window.location.href = "./summary.html";
    }, 1000);
  } catch (error) {
    handleSignupError(error);
  }
}

/**
 * Displays an error message based on the Firebase login error code.
 * @param {Error} error - The Firebase error object
 */
function handleLoginError(error) {
  const messages = {
    "auth/invalid-email": "Falsche E-Mail.",
    "auth/wrong-password": "Falsches Passwort.",
    "auth/user-not-found": "Nutzer nicht gefunden.",
    "auth/invalid-credential": "E-Mail oder Passwort ist falsch.",
    "auth/too-many-requests": "Zu viele Fehlversuche. Bitte warte kurz.",
  };
  showMessage(messages[error.code] || "Anderer Fehler: " + error.message);
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
    showMessage("Erfolgreich eingeloggt!");
    setTimeout(() => {
      window.location.href = "./summary.html";
    }, 2000);
  } catch (error) {
    handleLoginError(error);
  }
}

/**
 * Reads the login form values and triggers the login process.
 * @param {Event} event - The form submit event
 * @returns {Promise<void>}
 */
async function handleLogin(event) {
  const form = document.getElementById("login-signup-form");
  const email = form.querySelector("input[name='email']").value;
  const password = form.querySelector("input[name='password']").value;
  await login(email, password);
}

/**
 * Reads the signup form values and triggers the signup process.
 * @param {Event} event - The form submit event
 * @returns {Promise<void>}
 */
async function handleSignup(event) {
  const form = document.getElementById("login-signup-form");
  const name = form.querySelector("input[name='fullname']").value;
  const email = form.querySelector("input[name='email']").value;
  const password = form.querySelector("input[name='password']").value;
  await signup(name, email, password);
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
