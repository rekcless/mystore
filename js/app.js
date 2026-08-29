import { loadProductsSafe, productCard, categories } from "./products.js";

export function getCart(){try{return JSON.parse(localStorage.getItem("nova_cart"))||[]}catch{return[]}}
export function saveCart(cart){localStorage.setItem("nova_cart",JSON.stringify(cart));updateCartCount()}
export function updateCartCount(){const total=getCart().reduce((sum,item)=>sum+item.qty,0);document.querySelectorAll(".cart-count").forEach(el=>el.textContent=total)}
export function addToCart(id,qty=1){const cart=getCart(),found=cart.find(i=>i.id===id);if(found)found.qty+=qty;else cart.push({id,qty});saveCart(cart);showToast("Produk ditambahkan ke keranjang")}
function showToast(message){let toast=document.querySelector(".toast");if(!toast){toast=document.createElement("div");toast.className="toast";document.body.appendChild(toast)}toast.textContent=message;toast.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2200)}

async function initHome(){
  updateCartCount();
  if(!document.querySelector("#new-collection-products") && !document.querySelector("#category-grid")) return;
  try{
    const data=await loadProductsSafe();
    const catGrid=document.querySelector("#category-grid");
    if(catGrid)catGrid.innerHTML=categories().map(c=>`<a class="category-card" href="pages/products.html?category=${encodeURIComponent(c)}"><strong>${c}</strong><span>${data.filter(p=>p.category===c).length} produk</span></a>`).join("");

    const collectionEl=document.querySelector("#new-collection-products");
    const dotsEl=document.querySelector("#new-collection-dots");
    if(!collectionEl) return;

    // New Collection: ambil tepat 5 produk terbaru, lalu tampilkan satu per satu.
    const latest = data.slice(0, 5);
    const collectionEl = document.querySelector("#new-collection-products");
    const dotsEl = document.querySelector("#new-collection-dots");
    if(!collectionEl) return;

    if(!latest.length){
      collectionEl.innerHTML='<p class="empty">Belum ada produk.</p>';
      if(dotsEl) dotsEl.innerHTML="";
      return;
    }

    let current = 0;
    const renderProduct = (index, animate=true) => {
      current = index;
      if(animate) collectionEl.classList.add("collection-changing");
      setTimeout(() => {
        collectionEl.innerHTML = productCard(latest[current]);
        if(dotsEl) dotsEl.innerHTML = latest.map((_, i) =>
          `<button class="collection-dot ${i===current?"active":""}" data-product="${i}" aria-label="Produk terbaru ${i+1}"></button>`
        ).join("");
        requestAnimationFrame(() => collectionEl.classList.remove("collection-changing"));
      }, animate ? 180 : 0);
    };

    renderProduct(0, false);
    let timer = latest.length > 1 ? setInterval(() => {
      renderProduct((current + 1) % latest.length);
    }, 5000) : null;

    if(dotsEl){
      dotsEl.addEventListener("click", e => {
        const btn = e.target.closest("[data-product]");
        if(!btn) return;
        renderProduct(Number(btn.dataset.product));
        if(timer){
          clearInterval(timer);
          timer = setInterval(() => renderProduct((current + 1) % latest.length), 5000);
        }
      });
    }
  }catch(e){
    const collectionEl=document.querySelector("#new-collection-products");
    if(collectionEl)collectionEl.innerHTML='<p class="empty">Produk belum bisa dimuat. Cek koneksi Firebase dan Firestore Rules.</p>';
    console.error('NOVA Firestore homepage error:', e);
  }
}

document.addEventListener("DOMContentLoaded",initHome);
