import { db } from "./firebase.js";
import { calculatePennyScore } from "./scoreEngine.js";
import { fetchHomeDepotPrice } from "./homeDepot.js";

async function runTracker() {
  const snapshot = await db.collection("items").get();

  for (const doc of snapshot.docs) {
    const item = doc.data();

    const live = await fetchHomeDepotPrice(item.sku);

    if (!live.price) continue;

    const updated = {
      ...item,
      previousPrice: item.currentPrice,
      currentPrice: live.price,
      stock: live.stock,

      priceHistory: [
        ...(item.priceHistory || []),
        {
          price: live.price,
          time: new Date().toISOString()
        }
      ]
    };

    updated.pennyScore = calculatePennyScore({
      price: updated.currentPrice,
      previousPrice: updated.previousPrice,
      category: item.category,
      stock: updated.stock,
      dropCount: updated.priceHistory.length
    });

    await doc.ref.set(updated, { merge: true });
  }

  console.log("Live tracking complete");
}

runTracker();
