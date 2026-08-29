const cartEl=document.querySelector("#cart-content");
async function renderCart(){
  const cart=getCart();
  if(!cart.length){cartEl.innerHTML=`<div class="empty"><h2>Keranjang masih kosong.</h2><p>Yuk cari produk yang kamu suka.</p><br><a class="btn btn-dark" href="products.html">Lihat Produk</a></div>`;return}
  try{
    const all=await (await fetch(`${API_BASE}/products`)).json();
    const items=cart.map(i=>({...i,product:all.find(p=>p.id===i.id)})).filter(i=>i.product);
    const subtotal=items.reduce((s,i)=>s+i.product.price*i.qty,0);
    cartEl.innerHTML=`<div class="cart-layout"><div>${items.map(i=>`<div class="cart-item"><div class="cart-thumb">${productVisual(i.product)}</div><div><h3>${i.product.name}</h3><p>${i.product.category.name}</p><div class="quantity"><button data-action="minus" data-id="${i.id}">−</button><strong>${i.qty}</strong><button data-action="plus" data-id="${i.id}">+</button></div></div><div><div class="cart-price">${formatPrice(i.product.price*i.qty)}</div><button class="remove" data-action="remove" data-id="${i.id}">Hapus</button></div></div>`).join("")}</div><aside class="summary-card"><h2>Ringkasan</h2><div class="summary-row"><span>Subtotal</span><strong>${formatPrice(subtotal)}</strong></div><div class="summary-row"><span>Pengiriman</span><span>Gratis</span></div><div class="summary-total"><span>Total</span><span>${formatPrice(subtotal)}</span></div><a class="btn btn-dark btn-full summary-btn" href="checkout.html">Checkout →</a></aside></div>`;
  }catch{cartEl.innerHTML='<p class="empty">Backend belum aktif.</p>'}
}
cartEl.addEventListener("click",e=>{const btn=e.target.closest("[data-action]");if(!btn)return;const id=Number(btn.dataset.id),a=btn.dataset.action,cart=getCart(),item=cart.find(i=>i.id===id);if(a==="plus")item.qty++;if(a==="minus")item.qty=Math.max(1,item.qty-1);if(a==="remove")cart.splice(cart.findIndex(i=>i.id===id),1);saveCart(cart);renderCart()});
renderCart();