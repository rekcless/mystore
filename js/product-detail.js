import { db, doc, getDoc, collection, getDocs } from "./firebase-admin.js";

const detailEl = document.querySelector("#product-detail");
const relatedEl = document.querySelector("#related-products");
const id = new URLSearchParams(window.location.search).get("id");

const esc = v => String(v ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;", "'":"&#039;"}[c]));
const formatPrice = v => new Intl.NumberFormat("id-ID", {style:"currency", currency:"IDR", maximumFractionDigits:0}).format(Number(v)||0);

function visual(p, detail=false){
  if(p.image) return `<img src="${esc(p.image)}" alt="${esc(p.name)}">`;
  return `<div class="${detail ? "detail-placeholder" : "product-placeholder"}">${esc((p.name||"N").slice(0,1).toUpperCase())}</div>`;
}
function addCart(productId, qty){
  let cart=[]; try{cart=JSON.parse(localStorage.getItem("nova_cart"))||[]}catch{}
  const found=cart.find(x=>x.id===productId);
  if(found) found.qty += qty; else cart.push({id:productId, qty});
  localStorage.setItem("nova_cart", JSON.stringify(cart));
  document.querySelectorAll(".cart-count").forEach(el=>el.textContent=cart.reduce((s,x)=>s+(Number(x.qty)||0),0));
  let toast=document.querySelector(".toast");
  if(!toast){toast=document.createElement("div");toast.className="toast";document.body.appendChild(toast)}
  toast.textContent="Produk ditambahkan ke keranjang"; toast.classList.add("show");
  clearTimeout(window.__novaToast); window.__novaToast=setTimeout(()=>toast.classList.remove("show"),2200);
}
function card(p){
  return `<article class="product-card"><a class="product-link" href="product.html?id=${encodeURIComponent(p.id)}"><div class="product-image">${p.badge?`<span class="badge">${esc(p.badge)}</span>`:""}${visual(p)}</div><div class="product-info"><div><div class="product-name">${esc(p.name)}</div><div class="product-category">${esc(p.category||"")}</div></div><div class="product-price">${formatPrice(p.price)}</div></div></a></article>`;
}

async function init(){
  if(!id){detailEl.innerHTML='<div class="empty"><h2>Produk tidak ditemukan.</h2><br><a class="btn btn-dark" href="products.html">Kembali</a></div>';return;}
  try{
    const snap=await getDoc(doc(db,"products",id));
    if(!snap.exists()) throw new Error("Dokumen produk tidak ditemukan");
    const p={id:snap.id,...snap.data()};
    const stock=Math.max(0,Number(p.stock)||0);
    detailEl.innerHTML=`<div class="detail"><div class="detail-image">${visual(p,true)}</div><div class="detail-info"><span class="eyebrow">${esc(String(p.category||"PRODUK").toUpperCase())}</span><h1>${esc(p.name)}</h1><div class="detail-price">${formatPrice(p.price)}</div><p class="detail-description">${esc(p.description||"")}</p><p style="color:#888;font-size:13px;margin-bottom:20px">Stok: ${stock}</p><div class="quantity"><button id="minus" type="button">−</button><strong id="qty">1</strong><button id="plus" type="button">+</button></div><button id="add" class="btn btn-dark" type="button" ${stock<=0?'disabled':''}>${stock<=0?'Stok Habis':'Tambah ke Keranjang'} <span>→</span></button></div></div>`;
    let qty=1; const qtyEl=document.querySelector("#qty");
    document.querySelector("#minus").onclick=()=>{qty=Math.max(1,qty-1);qtyEl.textContent=qty};
    document.querySelector("#plus").onclick=()=>{if(stock>0)qty=Math.min(stock,qty+1);qtyEl.textContent=qty};
    document.querySelector("#add").onclick=()=>addCart(p.id,qty);
    document.querySelectorAll(".cart-count").forEach(el=>{let c=[];try{c=JSON.parse(localStorage.getItem("nova_cart"))||[]}catch{};el.textContent=c.reduce((s,x)=>s+(Number(x.qty)||0),0)});

    const allSnap=await getDocs(collection(db,"products"));
    const related=allSnap.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.id!==id).slice(0,4);
    relatedEl.innerHTML=related.map(card).join("");
  }catch(e){
    console.error("NOVA product detail error:",e);
    detailEl.innerHTML=`<div class="empty"><h2>Gagal memuat detail produk.</h2><p style="color:#888">${esc(e.code||e.message||"Firestore error")}</p><br><a class="btn btn-dark" href="products.html">Kembali ke Produk</a></div>`;
  }
}
init();
