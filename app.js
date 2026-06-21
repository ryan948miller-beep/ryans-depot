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
const saveBtn = document.getElementById("saveBtn");
const itemsDiv = document.getElementById("items");

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

saveBtn.onclick = async () => {
  const sku = document.getElementById("sku").value;
  const name = document.getElementById("name").value;
  const store = document.getElementById("store").value;
  const originalPrice = parseFloat(document.getElementById("originalPrice").value);
  const currentPrice = parseFloat(document.getElementById("currentPrice").value);
  const resalePrice = parseFloat(document.getElementById("resalePrice").value);
  const notes = document.getElementById("notes").value;

  const profit = resalePrice - currentPrice;

  await addDoc(collection(db, "items"), {
    sku,
    name,
    store,
    originalPrice,
    currentPrice,
    resalePrice,
    profit,
    notes,
    date: new Date()
  });

  loadItems();
};

async function loadItems() {
  itemsDiv.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "items"));

  querySnapshot.forEach((doc) => {
    const item = doc.data();

    itemsDiv.innerHTML += `
      <div class="item">
        <strong>${item.name}</strong><br>
        SKU: ${item.sku}<br>
        Store: ${item.store}<br>
        Current: $${item.currentPrice}<br>
        Resale: $${item.resalePrice}<br>
        Profit: $${item.profit}<br>
        Notes: ${item.notes}
      </div>
    `;
  });
}
