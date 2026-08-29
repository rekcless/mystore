import { loadProductsSafe, productCard, categories } from "./products.js";

export function getCart(){try{return JSON.parse(localStorage.getItem("nova_cart"))||[]}catch{return[]}}
export function saveCart(cart){localStorage.setItem("nova_cart",JSON.stringify(cart));updateCartCount()}
export function updateCartCount(){const total=getCart().reduce((sum,item)=>sum+item.qty,0);document.querySelectorAll(".cart-count").forEach(el=>el.textContent=total)}
export function addToCart(id,qty=1){const cart=getCart(),found=cart.find(i=>i.id===id);if(found)found.qty+=qty;else cart.push({id,qty});saveCart(cart);showToast("Produk ditambahkan ke keranjang")}
function showToast(message){let toast=document.querySelector(".toast");if(!toast){toast=document.createElement("div");toast.className="toast";document.body.appendChild(toast)}toast.textContent=message;toast.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2200)}

async function initHome(){
  updateCartCount();
  if(!document.querySelector("#featured-products") && !document.querySelector("#category-grid")) return;
  try{
    const data=await loadProductsSafe();
    const catGrid=document.querySelector("#category-grid");
    if(catGrid)catGrid.innerHTML=categories().map(c=>`<a class="category-card" href="pages/products.html?category=${encodeURIComponent(c)}"><strong>${c}</strong><span>${data.filter(p=>p.category===c).length} produk</span></a>`).join("");
    const featured=document.querySelector("#featured-products");
    if(featured)featured.innerHTML=data.slice(0,4).map(productCard).join("");
  }catch(e){
    const featured=document.querySelector("#featured-products");
    if(featured)featured.innerHTML='<p class="empty">Produk belum bisa dimuat. Cek koneksi Firebase dan Firestore Rules.</p>';
    console.error('NOVA Firestore homepage error:', e);
  }
}
document.addEventListener("DOMContentLoaded",initHome);
