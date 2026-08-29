const API_BASE = "http://localhost:3000/api";
let products = [];

async function loadProducts(){
  const res=await fetch(`${API_BASE}/products`);
  if(!res.ok) throw new Error("Backend tidak tersedia");
  products=await res.json();
  return products;
}
const formatPrice = price => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(price);
function productVisual(product, detail=false){
  if(product.image) return `<img src="${product.image}" alt="${product.name}">`;
  return `<div class="${detail ? "detail-placeholder" : "product-placeholder"}">${product.id}</div>`;
}
function productCard(product){
  return `<article class="product-card"><a class="product-link" href="product.html?id=${product.id}">
    <div class="product-image">${product.badge?`<span class="badge">${product.badge}</span>`:""}${productVisual(product)}</div>
    <div class="product-info"><div><div class="product-name">${product.name}</div><div class="product-category">${product.category?.name||product.category||""}</div></div><div class="product-price">${formatPrice(product.price)}</div></div>
  </a></article>`;
}
function categories(){return [...new Set(products.map(p=>p.category?.name||p.category))];}