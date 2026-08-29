import { db, doc, getDoc, collection, getDocs } from "./firebase-admin.js";
import { productVisual, productCard, formatPrice } from "./products.js";
import { addToCart, updateCartCount } from "./app.js";

const detailEl=document.querySelector("#product-detail"),relatedEl=document.querySelector("#related-products");
const id=new URLSearchParams(location.search).get("id");

async function init(){
 try{
   const snap=await getDoc(doc(db,"products",id)); if(!snap.exists())throw new Error("Produk tidak ditemukan");
   const product={id:snap.id,...snap.data()};
   detailEl.innerHTML=`<div class="detail"><div class="detail-image">${productVisual(product,true)}</div><div class="detail-info"><span class="eyebrow">${(product.category||"").toUpperCase()}</span><h1>${product.name}</h1><div class="detail-price">${formatPrice(product.price)}</div><p class="detail-description">${product.description||""}</p><p style="color:#888;font-size:13px;margin-bottom:20px">Stok: ${product.stock ?? 0}</p><div class="quantity"><button id="minus">−</button><strong id="qty">1</strong><button id="plus">+</button></div><button id="add" class="btn btn-dark">Tambah ke Keranjang <span>→</span></button></div></div>`;
   let qty=1;const qtyEl=document.querySelector("#qty");
   document.querySelector("#minus").onclick=()=>{qty=Math.max(1,qty-1);qtyEl.textContent=qty};
   document.querySelector("#plus").onclick=()=>{qty=Math.min(product.stock||999,qty+1);qtyEl.textContent=qty};
   document.querySelector("#add").onclick=()=>addToCart(product.id,qty);
   updateCartCount();
   const all=await getDocs(collection(db,"products"));
   const related=all.docs.map(d=>({id:d.id,...d.data()})).filter(p=>p.id!==id).slice(0,4);
   relatedEl.innerHTML=related.map(productCard).join("");
 }catch(e){detailEl.innerHTML='<div class="empty"><h2>Produk tidak ditemukan atau Firestore belum aktif.</h2><br><a class="btn btn-dark" href="products.html">Kembali</a></div>';console.error(e)}
}
init();
