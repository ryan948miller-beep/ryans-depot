import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNhrbPLoIM66FkHzx3si5nqGl8JP3XuGU",
  authDomain: "ryans-depot.firebaseapp.com",
  projectId: "ryans-depot",
  storageBucket: "ryans-depot.firebasestorage.app",
  messagingSenderId: "312220432397",
  appId: "1:312220432397:web:7855072ff18da248263d44"
};

// INIT (must be FIRST)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// UI
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const appDiv = document.getElementById("app");
const itemsDiv = document.getElementById("itemsList");

// ---------------- LOGIN ----------------
loginBtn.onclick = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    await signInWithRedirect(auth, provider);
  } catch (err) {
    console.error("Login error:", err);
  }
};

// ---------------- HANDLE REDIRECT ----------------
getRedirectResult(auth)
  .then((result) => {
    if (result?.user) {
      console.log("Logged in:", result.user.email);
    }
  })
  .catch((error) => {
    console.error("Redirect error:", error);
  });

// ---------------- LOGOUT ----------------
logoutBtn.onclick = () => signOut(auth);

// ---------------- AUTH STATE ----------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    appDiv.style.display = "block";
    loadItems();
  } else {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    appDiv.style.display = "none";
  }
});

// ---------------- LOAD ITEMS ----------------
async function loadItems() {
  itemsDiv.innerHTML = "";

  const snapshot = await getDocs(collection(db, "items"));

  snapshot.forEach((doc) => {
    const item = doc.data();

    itemsDiv.innerHTML += `
      <div style="border:1px solid #ccc; padding:8px; margin:5px;">
        <b>${item.name || "No name"}</b><br>
        SKU: ${item.sku || "N/A"}<br>
        Category: ${item.category || "N/A"}<br>
        Price: $${item.currentPrice || 0}<br>
        Score: ${item.pennyScore || 0}
      </div>
    `;
  });
}
