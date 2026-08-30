import { loadProductsSafe, productCard, categories } from "./products.js";

export function getCart(){try{return JSON.parse(localStorage.getItem("nova_cart"))||[]}catch{return[]}}
export function saveCart(cart){localStorage.setItem("nova_cart",JSON.stringify(cart));updateCartCount()}
export function updateCartCount(){const total=getCart().reduce((sum,item)=>sum+item.qty,0);document.querySelectorAll(".cart-count").forEach(el=>el.textContent=total)}
export function addToCart(id,qty=1){const cart=getCart(),found=cart.find(i=>i.id===id);if(found)found.qty+=qty;else cart.push({id,qty});saveCart(cart);showToast("Produk ditambahkan ke keranjang")}
function showToast(message){let toast=document.querySelector(".toast");if(!toast){toast=document.createElement("div");toast.className="toast";document.body.appendChild(toast)}toast.textContent=message;toast.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2200)}

function timeValue(value){
  if(!value) return 0;
  if(typeof value.toMillis === "function") return value.toMillis();
  if(typeof value.seconds === "number") return value.seconds * 1000 + Math.floor((value.nanoseconds||0)/1e6);
  if(value instanceof Date) return value.getTime();
  const parsed=Date.parse(value);
  return Number.isNaN(parsed)?0:parsed;
}

function newestFive(data){
  return [...data]
    .sort((a,b)=>{
      const at=timeValue(a.createdAt)||timeValue(a.updatedAt);
      const bt=timeValue(b.createdAt)||timeValue(b.updatedAt);
      return bt-at;
    })
    .slice(0,5);
}

async function initHome(){
  updateCartCount();
  if(!document.querySelector("#new-collection-products") && !document.querySelector("#category-grid")) return;

  try{
    const data=await loadProductsSafe();

    // Kategori tetap memakai SEMUA produk.
    const catGrid=document.querySelector("#category-grid");
    if(catGrid){
      catGrid.innerHTML=categories().map(c=>`<a class="category-card" href="pages/products.html?category=${encodeURIComponent(c)}"><strong>${c}</strong><span>${data.filter(p=>p.category===c).length} produk</span></a>`).join("");
    }

    // Hero New Collection: tampilkan tepat 5 produk terbaru, satu per satu tiap 5 detik.
    const heroContent=document.querySelector("#hero-product-content");
    const heroCaption=document.querySelector("#hero-product-caption");
    if(heroContent){
      const heroLatest=newestFive(data);
      let heroIndex=0;
      const paintHero=()=>{
        const p=heroLatest[heroIndex];
        if(!p)return;
        heroContent.innerHTML=p.image
          ? `<img src="${p.image}" alt="${p.name}">`
          : `<div class="hero-product-fallback">${String(p.name||"N").slice(0,1).toUpperCase()}</div>`;
        if(heroCaption) heroCaption.textContent=p.name || "Discover something new.";
      };
      paintHero();
      if(heroLatest.length>1){
        setInterval(()=>{ heroIndex=(heroIndex+1)%heroLatest.length; paintHero(); },5000);
      }
    }

    const collectionEl=document.querySelector("#new-collection-products");
    const dotsEl=document.querySelector("#new-collection-dots");
    if(!collectionEl) return;

    // Tepat 5 produk terbaru. Tidak ada query orderBy yang bisa gagal
    // hanya karena sebagian dokumen lama belum punya createdAt.
    const latest=newestFive(data);

    if(!latest.length){
      collectionEl.innerHTML='<p class="empty">Belum ada produk baru.</p>';
      if(dotsEl)dotsEl.innerHTML="";
      return;
    }

    let current=0;
    let timer=null;

    function paint(index, animate=false){
      current=(index+latest.length)%latest.length;
      if(animate)collectionEl.classList.add("collection-changing");
      const draw=()=>{
        collectionEl.innerHTML=productCard(latest[current]);
        if(dotsEl){
          dotsEl.innerHTML=latest.map((_,i)=>`<button type="button" class="collection-dot ${i===current?"active":""}" data-product="${i}" aria-label="Produk terbaru ${i+1}"></button>`).join("");
        }
        requestAnimationFrame(()=>collectionEl.classList.remove("collection-changing"));
      };
      if(animate)setTimeout(draw,180);else draw();
    }

    function restart(){
      if(timer)clearInterval(timer);
      timer=setInterval(()=>paint(current+1,true),5000);
    }

    paint(0,false);
    restart();

    if(dotsEl){
      dotsEl.onclick=e=>{
        const btn=e.target.closest("[data-product]");
        if(!btn)return;
        paint(Number(btn.dataset.product),true);
        restart();
      };
    }

  }catch(e){
    // Hero New Collection: tampilkan tepat 5 produk terbaru, satu per satu tiap 5 detik.
    const heroContent=document.querySelector("#hero-product-content");
    const heroCaption=document.querySelector("#hero-product-caption");
    if(heroContent){
      const heroLatest=newestFive(data);
      let heroIndex=0;
      const paintHero=()=>{
        const p=heroLatest[heroIndex];
        if(!p)return;
        heroContent.innerHTML=p.image
          ? `<img src="${p.image}" alt="${p.name}">`
          : `<div class="hero-product-fallback">${String(p.name||"N").slice(0,1).toUpperCase()}</div>`;
        if(heroCaption) heroCaption.textContent=p.name || "Discover something new.";
      };
      paintHero();
      if(heroLatest.length>1){
        setInterval(()=>{ heroIndex=(heroIndex+1)%heroLatest.length; paintHero(); },5000);
      }
    }

    const collectionEl=document.querySelector("#new-collection-products");
    if(collectionEl)collectionEl.innerHTML='<p class="empty">Produk belum bisa dimuat. Cek koneksi Firebase dan Firestore Rules.</p>';
    console.error("NOVA Firestore homepage error:",e);
  }
}

document.addEventListener("DOMContentLoaded",initHome);
