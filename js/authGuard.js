import { auth, db } from "./firebaseAuth.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";
const homePaths = ["/", "/index.html", "index.html"];
const path = window.location.pathname;

onAuthStateChanged(auth, async (user) => {  
  if (user) {
    const snapshot = await get(ref(db, `users/${user.uid}`));
    const { contactId } = snapshot.val();
    
    const contactSnap = await get(ref(db, `contacts/${contactId}`));
    window.currentUser = contactSnap.val();
    renderUserMenue();
    if (homePaths.includes(path)) {
      window.location.href = "./summary.html";
    }
  } else {
    if (!homePaths.includes(path)) {
      window.location.href = "./index.html";
    }
  }
});

async function logout() {
  await signOut(auth);
}

window.logout = logout;