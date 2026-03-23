import { auth, db } from "./firebaseauth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

onAuthStateChanged(auth, async (user) => {
    console.log("Auth State:", user); // ← was kommt hier raus?

  if (user) {
    const snapshot = await get(ref(db, `users/${user.uid}`));
    const { contactId } = snapshot.val();

    const contactSnap = await get(ref(db, `contacts/${contactId}`));
    window.currentUser = contactSnap.val();
  } else {
    window.location.href = "./index.html";
  }
});
