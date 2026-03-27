import { db } from "./firebaseAuth.js";
import { ref, get, set, remove } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

async function loadData(path = "") {
  try {
    const snapshot = await get(ref(db, path));
    return snapshot.val();
  } catch (error) {
    showMessage(error);
  }
}

async function postData(path = "", data = {}) {
  try {
    const newRef = ref(db, path + "/" + crypto.randomUUID());
    await set(newRef, data);
    return { name: newRef.key };
  } catch (error) {
    showMessage(error);
  }
}

async function putData(path = "", data = {}) {
  try {
    await set(ref(db, path), data);
  } catch (error) {
    showMessage("Keine Berechtigung für diese Aktion.");
    throw error;
  }
}

async function deleteData(path = "") {
  try {
    await remove(ref(db, path));
  } catch (error) {
     showMessage("Keine Berechtigung für diese Aktion.");
    throw error;
  }
}

window.loadData = loadData;
window.postData = postData;
window.putData = putData;
window.deleteData = deleteData;


// const FB_URL = "https://join-database-3e254-default-rtdb.europe-west1.firebasedatabase.app/";

// async function loadData(path = "") {
//   try {
//     let response = await fetch(FB_URL + path + ".json");
//     return await response.json();
//   } catch (error) {
//     showMessage(error);
//   }
// }

// async function postData(path = "", data = {}) {
//   try {
//     let response = await fetch(FB_URL + path + ".json", {
//       method: "POST",
//       header: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
  
//     return (responseToJson = await response.json());

//   } catch (error) {
//     showMessage(error);
//   }
// }

// async function deleteData(path="") {
//   try {
//     let response = await fetch(FB_URL + path + ".json", {
//       method: "DELETE",
//     });
//     return (responseToJson = await response.json());
    
//   } catch (error) {
//     showMessage(error);
//   }
// }

// async function putData(path = "", data = {}) {
//   try {
//     let response = await fetch(FB_URL + path + ".json", {
//       method: "PUT",
//       header: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
    
//     return (responseToJson = await response.json());
//   } catch (error) {
//     showMessage(error);
//   }
// }

