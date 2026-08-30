import { db, collection, getDocs, query, orderBy } from "./firebase-admin.js";

let products = [];

export async function loadProducts() {
  const snap = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc")));
  products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return products;
}

export async function loadProductsSafe() {
  try {
    return await loadProducts();
  } catch (err) {
    // Fallback for older Firestore documents that may not have createdAt.
    const snap = await getDocs(collection(db, "products"));
    products = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    return products;
  }
}

export const formatPrice = price => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0
}).format(Number(price) || 0);

export function productVisual(product, detail = false) {
  if (product.image) return `<img src="${product.image}" alt="${product.name}">`;
  return `<div class="${detail ? "detail-placeholder" : "product-placeholder"}">${String(product.name || "N").slice(0,1).toUpperCase()}</div>`;
}

export function productCard(product) {
  return `<article class="product-card">
    <a class="product-link" href="${location.pathname.includes("/pages/") ? "product.html" : "pages/product.html"}?id=${encodeURIComponent(product.id)}">
      <div class="product-image">${product.badge ? `<span class="badge">${product.badge}</span>` : ""}${productVisual(product)}</div>
      <div class="product-info"><div><div class="product-name">${product.name}</div><div class="product-category">${product.category || ""}</div></div><div class="product-price">${formatPrice(product.price)}</div></div>
    </a>
  </article>`;
}

export function categories() {
  return [...new Set(products.map(p => p.category).filter(Boolean))];
}

// Compatibility for the existing storefront scripts.
window.NOVAStore = { loadProducts, loadProductsSafe, formatPrice, productVisual, productCard, categories };
