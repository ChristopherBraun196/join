import { auth, db } from "./firebaseAuth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "./index.html";
    return;
  }

  const nameElement = document.querySelector(".welcome_name");

  if (user.isAnonymous) {
    nameElement.textContent = "Guest";
  } else {
    const userSnap = await get(ref(db, `users/${user.uid}`));
    const contactId = userSnap.val()?.contactId;
    const contactSnap = await get(ref(db, `contacts/${contactId}`));
    nameElement.textContent = contactSnap.val()?.name || user.email;
  }
});