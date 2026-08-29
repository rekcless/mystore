function getCart(){try{return JSON.parse(localStorage.getItem("nova_cart"))||[]}catch{return[]}}
function saveCart(cart){localStorage.setItem("nova_cart",JSON.stringify(cart));updateCartCount()}
function updateCartCount(){const total=getCart().reduce((sum,item)=>sum+item.qty,0);document.querySelectorAll(".cart-count").forEach(el=>el.textContent=total)}
function addToCart(id,qty=1){const cart=getCart(),found=cart.find(i=>i.id===id);if(found)found.qty+=qty;else cart.push({id,qty});saveCart(cart);showToast("Produk ditambahkan ke keranjang")}
function showToast(message){let toast=document.querySelector(".toast");if(!toast){toast=document.createElement("div");toast.className="toast";document.body.appendChild(toast)}toast.textContent=message;toast.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2200)}
async function initHome(){
  updateCartCount();
  try{
    await loadProducts();
    const catGrid=document.querySelector("#category-grid");
    if(catGrid)catGrid.innerHTML=categories().map(c=>`<a class="category-card" href="pages/products.html?category=${encodeURIComponent(c)}"><strong>${c}</strong><span>${products.filter(p=>(p.category?.name||p.category)===c).length} produk</span></a>`).join("");
    const featured=document.querySelector("#featured-products");
    if(featured)featured.innerHTML=products.slice(0,4).map(productCard).join("");
  }catch(e){
    document.querySelectorAll(".product-grid").forEach(el=>el.innerHTML='<p class="empty">Backend belum aktif. Jalankan server NOVA terlebih dahulu.</p>');
  }
}
document.addEventListener("DOMContentLoaded",initHome);