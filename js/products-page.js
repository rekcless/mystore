import { db, collection, getDocs } from "./firebase-admin.js";
import { productCard } from "./products.js";

const listEl=document.querySelector("#product-list"),searchEl=document.querySelector("#search-input"),filterEl=document.querySelector("#category-filter"),sortEl=document.querySelector("#sort-select"),emptyEl=document.querySelector("#empty-state");
let allProducts=[];

async function renderProducts(){
  let data=allProducts.filter(p=>{
    const q=searchEl.value.trim().toLowerCase();
    const okQ=!q || `${p.name} ${p.description||""}`.toLowerCase().includes(q);
    const okC=filterEl.value==="all" || p.category===filterEl.value;
    return okQ && okC;
  });
  if(sortEl.value==="price-low")data.sort((a,b)=>a.price-b.price);
  if(sortEl.value==="price-high")data.sort((a,b)=>b.price-a.price);
  if(sortEl.value==="name")data.sort((a,b)=>a.name.localeCompare(b.name));
  listEl.innerHTML=data.map(productCard).join("");
  emptyEl.classList.toggle("hidden",data.length>0);
}

(async()=>{
 try{
   const snap=await getDocs(collection(db,"products"));
   allProducts=snap.docs.map(d=>({id:d.id,...d.data()}));
   const cats=[...new Set(allProducts.map(p=>p.category).filter(Boolean))];
   cats.forEach(c=>filterEl.insertAdjacentHTML("beforeend",`<option value="${c}">${c}</option>`));
   const cat=new URLSearchParams(location.search).get("category");if(cat)filterEl.value=cat;
   await renderProducts();
 }catch(e){listEl.innerHTML='<p class="empty">Gagal memuat produk dari Firestore.</p>';console.error(e)}
})();
[searchEl,filterEl,sortEl].forEach(el=>el.addEventListener("input",renderProducts));
