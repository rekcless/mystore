const detailEl=document.querySelector("#product-detail"),relatedEl=document.querySelector("#related-products");
const id=Number(new URLSearchParams(location.search).get("id"));
async function init(){
  try{
    const res=await fetch(`${API_BASE}/products/${id}`); if(!res.ok)throw new Error();
    const product=await res.json();
    detailEl.innerHTML=`<div class="detail"><div class="detail-image">${productVisual(product,true)}</div><div class="detail-info">
      <span class="eyebrow">${product.category.name.toUpperCase()}</span><h1>${product.name}</h1><div class="detail-price">${formatPrice(product.price)}</div>
      <p class="detail-description">${product.description}</p><p style="color:#888;font-size:13px;margin-bottom:20px">Stok: ${product.stock}</p>
      <div class="quantity"><button id="minus">−</button><strong id="qty">1</strong><button id="plus">+</button></div>
      <button id="add" class="btn btn-dark">Tambah ke Keranjang <span>→</span></button></div></div>`;
    let qty=1;const qtyEl=document.querySelector("#qty");
    document.querySelector("#minus").onclick=()=>{qty=Math.max(1,qty-1);qtyEl.textContent=qty};
    document.querySelector("#plus").onclick=()=>{qty=Math.min(product.stock||999,qty+1);qtyEl.textContent=qty};
    document.querySelector("#add").onclick=()=>addToCart(product.id,qty);
    const all=await (await fetch(`${API_BASE}/products`)).json();
    relatedEl.innerHTML=all.filter(p=>p.id!==id).slice(0,4).map(productCard).join("");
  }catch{detailEl.innerHTML='<div class="empty"><h2>Produk tidak ditemukan atau backend belum aktif.</h2><br><a class="btn btn-dark" href="products.html">Kembali</a></div>'}
}
init();