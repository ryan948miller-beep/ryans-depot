import axios from "axios";
import { db } from "./firebase.js";
import { calculatePennyScore } from "./scoreEngine.js";

const categories = [
  "tools",
  "hardware",
  "electrical",
  "plumbing",
  "lighting",
  "patio",
  "lawn-garden",
  "seasonal",
  "appliances",
  "storage",
  "cleaning",
  "automotive",
  "safety",
  "smart-home",
  "kitchen",
  "bath"
];

// placeholder function (you can upgrade later with real endpoints)
async function fetchCategoryItems(category) {
  // In real V2 this would pull from:
  // - product feeds
  // - allowed public endpoints
  // - saved SKU seeds

  return [
    {
      sku: "demo-1",
      name: "Sample Tool",
      price: 9.03,
      previousPrice: 19.03,
      category,
      stock: "low",
      dropCount: 2
    }
  ];
}

async function run() {
  for (const category of categories) {
    const items = await fetchCategoryItems(category);

    for (const item of items) {
      const score = calculatePennyScore(item);

      const ref = db.collection("items").doc(item.sku);

      const snap = await ref.get();
      const old = snap.exists ? snap.data() : null;

      await ref.set({
        ...item,
        previousPrice: old?.price || item.previousPrice,
        price: item.price,
        category,
        pennyScore: score,
        lastChecked: new Date().toISOString()
      }, { merge: true });
    }
  }

  console.log("Crawl complete");
}

run();
