import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth }                from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getDatabase }            from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";


const firebaseConfig = {
  apiKey: "",
  authDomain: "join-database-3e254.firebaseapp.com",
  databaseURL: "https://join-database-3e254-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "join-database-3e254",
  storageBucket: "join-database-3e254.firebasestorage.app",
  messagingSenderId: "310202130189",
  appId: "1:310202130189:web:f92076b67bfc6a71fc5a44",
  measurementId: "G-XFEF879ML0"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db   = getDatabase(app);