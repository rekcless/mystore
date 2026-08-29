const listEl=document.querySelector("#product-list"),searchEl=document.querySelector("#search-input"),filterEl=document.querySelector("#category-filter"),sortEl=document.querySelector("#sort-select"),emptyEl=document.querySelector("#empty-state");
async function renderProducts(){
  try{
    const q=encodeURIComponent(searchEl.value.trim()), cat=filterEl.value==="all"?"":encodeURIComponent(filterEl.value), sort=sortEl.value;
    const data=await (await fetch(`${API_BASE}/products?search=${q}${cat?`&category=${cat}`:""}&sort=${sort}`)).json();
    listEl.innerHTML=data.map(productCard).join("");emptyEl.classList.toggle("hidden",data.length>0);
  }catch{listEl.innerHTML='<p class="empty">Backend belum aktif.</p>'}
}
(async()=>{
  try{
    const cats=await (await fetch(`${API_BASE}/categories`)).json();
    cats.forEach(c=>filterEl.insertAdjacentHTML("beforeend",`<option value="${c.name}">${c.name}</option>`));
    const cat=new URLSearchParams(location.search).get("category");if(cat)filterEl.value=cat;
    renderProducts();
  }catch{renderProducts()}
})();
[searchEl,filterEl,sortEl].forEach(el=>el.addEventListener("input",renderProducts));