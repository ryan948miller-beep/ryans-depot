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

loginBtn.onclick = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

logoutBtn.onclick = async () => {
  await signOut(auth);
};

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

window.addItem = async function () {
  const sku = document.getElementById("skuInput").value;
  const name = document.getElementById("nameInput").value;
  const category = document.getElementById("categoryInput").value;

  if (!sku || !name) {
    alert("Enter SKU + name");
    return;
  }

  await addSKU(sku, name, category);

  alert("Item added!");
  loadItems();
};

async function loadItems() {
  itemsDiv.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "items"));

  querySnapshot.forEach((doc) => {
    const item = doc.data();

    itemsDiv.innerHTML += `
      <div class="item">
        <strong>${item.name || "No name"}</strong><br>
        SKU: ${item.sku}<br>
        Category: ${item.category}<br>
        Price: $${item.currentPrice || 0}<br>
        Score: ${item.pennyScore || 0}
      </div>
    `;
  });
}
