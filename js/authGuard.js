import { auth, db } from "./firebaseAuth.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import {
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";
const homePaths = ["/", "/index.html", "index.html"];
const publicPaths = [
  "/privacy.html",
  "privacy.html",
  "/legal.html",
  "legal.html",
  "/help.html",
  "help.html",
];
const path = window.location.pathname;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    if (user.isAnonymous) {
      window.currentUser = { name: "Guest" };
      renderUserMenue();
      if (homePaths.includes(path)) {
        window.location.href = "./summary.html";
      } else if (publicPaths.includes(path)) {
        const page = path.includes("privacy")
          ? "privacy"
          : path.includes("legal")
            ? "legal"
            : "help";
        if (typeof loadSidebar === "function") loadSidebar(page);
      }
      return;
    }
    const snapshot = await get(ref(db, `users/${user.uid}`));
    if (!snapshot.val()) return;
    const { contactId } = snapshot.val();
    const contactSnap = await get(ref(db, `contacts/${contactId}`));
    window.currentUser = contactSnap.val();
    renderUserMenue();
    if (homePaths.includes(path)) {
      window.location.href = "./summary.html";
    } else if (publicPaths.includes(path)) {
      const page = path.includes("privacy")
        ? "privacy"
        : path.includes("legal")
          ? "legal"
          : "help";
      if (typeof loadSidebar === "function") loadSidebar(page);
    }
  } else {
    if (publicPaths.includes(path)) {
      if (typeof switchToGuestSidebar === "function") switchToGuestSidebar();
    } else if (!homePaths.includes(path)) {
      window.location.href = "./index.html";
    }
  }
});

/**
 * Signs out the current user from Firebase.
 * @returns {Promise<void>}
 */
async function logout() {
  await signOut(auth);
  window.location.href = "/";
}

window.logout = logout;
