import axios from "axios";

export async function fetchHomeDepotPrice(sku) {
  try {
    const url = `https://www.homedepot.com/p/${sku}`;

    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = res.data;

    const priceMatch = html.match(/\$(\d+\.\d{2})/);

    return {
      price: priceMatch ? parseFloat(priceMatch[1]) : null,
      stock: html.includes("In Stock") ? "in-stock" : "unknown"
    };

  } catch (e) {
    return { price: null, stock: "error" };
  }
}
