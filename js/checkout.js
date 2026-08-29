const summaryEl=document.querySelector("#checkout-summary"),form=document.querySelector("#checkout-form");
async function initCheckout(){
 const cart=getCart();
 if(!cart.length){summaryEl.innerHTML=`<h2>Keranjang kosong</h2><p>Tambahkan produk sebelum checkout.</p><br><a class="btn btn-dark" href="products.html">Lihat Produk</a>`;form.style.display="none";return}
 try{
  const all=await (await fetch(`${API_BASE}/products`)).json();
  const items=cart.map(i=>({...i,product:all.find(p=>p.id===i.id)})).filter(i=>i.product);
  const total=items.reduce((s,i)=>s+i.product.price*i.qty,0);
  summaryEl.innerHTML=`<h2>Pesanan kamu</h2>${items.map(i=>`<div class="summary-row"><span>${i.product.name} × ${i.qty}</span><strong>${formatPrice(i.product.price*i.qty)}</strong></div>`).join("")}<div class="summary-total"><span>Total</span><span>${formatPrice(total)}</span></div>`;
  form.addEventListener("submit",e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form));const orderId="NOVA-"+Date.now().toString().slice(-6);localStorage.removeItem("nova_cart");document.querySelector("main").innerHTML=`<div class="order-success"><div class="check">✓</div><span class="eyebrow">ORDER DEMO</span><h2>Pesanan berhasil dibuat.</h2><p>Nomor pesanan: <strong>${orderId}</strong><br>Pembayaran: ${data.payment}</p><a class="btn btn-dark" href="../index.html">Kembali ke Home</a></div>`;updateCartCount()});
 }catch{summaryEl.innerHTML='<p>Backend belum aktif.</p>';form.style.display="none"}
}
initCheckout();