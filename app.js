import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { addSKU } from "./addItem.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBNhrbPLoIM66FkHzx3si5nqGl8JP3XuGU",
  authDomain: "ryans-depot.firebaseapp.com",
  projectId: "ryans-depot",
  storageBucket: "ryans-depot.firebasestorage.app",
  messagingSenderId: "312220432397",
  appId: "1:312220432397:web:7855072ff18da248263d44"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// UI elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const appDiv = document.getElementById("app");
const itemsDiv = document.getElementById("itemsList");

// ---------------- LOGIN FIX ----------------
loginBtn.onclick = async () => {
  try {
    const provider = new GoogleAuthProvider();

    // IMPORTANT: prevents silent popup crash issues
    provider.setCustomParameters({
      prompt: "select_account"
    });

    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("Login error:", err);
    alert("Google sign-in failed. Check Firebase Authorized Domains.");
  }
};

// ---------------- LOGOUT ----------------
logoutBtn.onclick = async () => {
  await signOut(auth);
};

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

// ---------------- ADD ITEM ----------------
window.addItem = async function () {
  const sku = document.getElementById("skuInput").value;
  const name = document.getElementById("nameInput").value;
  const category = document.getElementById("categoryInput").value;

  if (!sku || !name) {
    alert("Enter SKU + name");
    return;
  }

  try {
    await addSKU(sku, name, category);
    alert("Item added!");
    loadItems();
  } catch (err) {
    console.error(err);
    alert("Failed to add item");
  }
};

// ---------------- LOAD ITEMS ----------------
async function loadItems() {
  itemsDiv.innerHTML = "";

  const snapshot = await getDocs(collection(db, "items"));

  snapshot.forEach((docSnap) => {
    const item = docSnap.data();

    itemsDiv.innerHTML += `
      <div class="item" style="border:1px solid #ccc; padding:8px; margin:5px;">
        <strong>${item.name || "No name"}</strong><br>
        SKU: ${item.sku}<br>
        Category: ${item.category || "N/A"}<br>
        Price: $${item.currentPrice || 0}<br>
        Score: ${item.pennyScore || 0}
      </div>
    `;
  });
}
