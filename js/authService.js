import { auth, db } from "./firebaseAuth.js";
import { createUserWithEmailAndPassword,
         signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

export const AVATAR_COLORS = [
  "#FF7043", "#E91E8C", "#9C27B0", "#3F51B5",
  "#00BCD4", "#4CAF50", "#FF9800", "#795548"
];

export function selectRandomAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

async function signup(name, email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
  
        const contactId = `contact-${crypto.randomUUID()}`;
        await set(ref(db, `contacts/${contactId}`), {
            id: contactId,
            name: name,
            email: email,
            avatarColor: selectRandomAvatarColor(),
            uid: uid 
        });

        await set(ref(db, `users/${uid}`), {
            contactId: contactId
        });

        showMessage("Signup erfolgreich!");

    } catch (error) {
        switch (error.code) {
            case "auth/email-already-in-use":
                showMessage("Diese E-Mail ist bereits registriert.");
                break;
            case "auth/invalid-email":
                showMessage("Ungültige E-Mail-Adresse.");
                break;
            case "auth/weak-password":
                showMessage("Passwort zu schwach (min. 6 Zeichen).");
                break;
            default:
                showMessage("Fehler: " + error.message);
        }
    }
}

async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Eingeloggt:", userCredential.user.uid);
    showMessage("Eingeloggt:", userCredential.user.uid);
}

window.signup = signup;
window.login = login;
