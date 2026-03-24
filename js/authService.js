import { auth, db } from "./firebaseAuth.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import {
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

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

export function selectRandomAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

async function createContactEntry(uid, name, email) {
  const contactId = `contact-${crypto.randomUUID()}`;
  await set(ref(db, `contacts/${contactId}`), {
    id: contactId,
    name: name,
    email: email,
    avatarColor: selectRandomAvatarColor(),
    uid: uid,
  });
  return contactId;
}

async function createUserEntry(uid, contactId) {
  await set(ref(db, `users/${uid}`), {
    contactId: contactId,
  });
}

function handleSignupError(error) {
  const messages = {
    "auth/email-already-in-use": "Diese E-Mail ist bereits registriert.",
    "auth/invalid-email": "Ungültige E-Mail-Adresse.",
    "auth/weak-password": "Passwort zu schwach (min. 6 Zeichen).",
  };
  showMessage(messages[error.code] || "Anderer Fehler: " + error.message);
}

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

async function handleLogin(event) {
  const form = document.getElementById("login-signup-form");
  const email = form.querySelector("input[name='email']").value;
  const password = form.querySelector("input[name='password']").value;
  await login(email, password);
}

async function handleSignup(event) {
  const form = document.getElementById("login-signup-form");
  const name = form.querySelector("input[name='fullname']").value;
  const email = form.querySelector("input[name='email']").value;
  const password = form.querySelector("input[name='password']").value;
  await signup(name, email, password);
}

window.signup = signup;
window.login = login;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
