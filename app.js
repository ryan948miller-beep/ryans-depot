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
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { addSKU } from "./addItem.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNhrbPLoIM66FkHzx3si5nqGl8JP3XuGU",
  authDomain: "ryans-depot.firebaseapp.com",
  projectId: "ryans-depot",
  storageBucket: "ryans-depot.firebasestorage.app",
  messagingSenderId: "312220432397",
  appId: "1:312220432397:web:7855072ff18da248263d44"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const appDiv = document.getElementById("app");
const itemsDiv = document.getElementById("itemsList");
const addBtn = document.getElementById("addBtn");

// ---------------- LOGIN ----------------
import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

loginBtn.onclick = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  await signInWithRedirect(auth, provider);
};

getRedirectResult(auth)
  .then((result) => {
    if (result?.user) {
      console.log("Logged in:", result.user);
    }
  })
  .catch((err) => console.error(err));
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
addBtn.onclick = async () => {
  const sku = document.getElementById("skuInput").value;
  const name = document.getElementById("nameInput").value;
  const category = document.getElementById("categoryInput").value;

  if (!sku || !name) {
    alert("Missing SKU or name");
    return;
  }

  await addSKU(sku, name, category);

  loadItems();
};

// ---------------- LOAD ITEMS ----------------
async function loadItems() {
  itemsDiv.innerHTML = "";

  const snapshot = await getDocs(collection(db, "items"));

  snapshot.forEach((doc) => {
    const item = doc.data();

    itemsDiv.innerHTML += `
      <div style="border:1px solid #ccc; padding:8px; margin:5px;">
        <b>${item.name}</b><br>
        SKU: ${item.sku}<br>
        Category: ${item.category}<br>
        Price: $${item.currentPrice || 0}<br>
        Score: ${item.pennyScore || 0}
      </div>
    `;
  });
}
