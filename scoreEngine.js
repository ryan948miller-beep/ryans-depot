export function calculatePennyScore(item) {
  let score = 0;

  const price = item.price || 0;
  const prev = item.previousPrice || price;

  const drop = prev - price;
  const dropPercent = prev > 0 ? drop / prev : 0;

  // 1. price drop velocity
  score += Math.min(dropPercent * 100, 35);

  // 2. stage detection (.06 / .03 / .01 style logic)
  if (price % 1 === 0.03) score += 35;
  if (price % 1 === 0.06) score += 15;
  if (price % 1 === 0.01) score += 60;

  // 3. repeated drops
  if (item.dropCount > 2) score += 15;

  // 4. category weighting
  const hotCategories = ["tools", "seasonal", "lighting", "outdoor"];
  if (hotCategories.includes(item.category)) score += 10;

  // 5. stock pressure
  if (item.stock === "low") score += 10;

  // clamp
  return Math.min(Math.round(score), 100);
}
