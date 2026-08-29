import { auth, createUserWithEmailAndPassword, db, doc, setDoc, serverTimestamp } from "./firebase-admin.js";
const form=document.querySelector("#setup-form"), msg=document.querySelector("#msg");
const usernameToInternalEmail = username => `${username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "") || "admin"}@nova-admin.com`;
form.addEventListener("submit",async e=>{
 e.preventDefault(); msg.textContent="Membuat admin...";
 const username=document.querySelector("#username").value.trim(); const password=document.querySelector("#password").value;
 if(username.length<3){msg.textContent="ID minimal 3 karakter.";return}
 if(password.length<6){msg.textContent="Password minimal 6 karakter.";return}
 try{
   const cred=await createUserWithEmailAndPassword(auth,usernameToInternalEmail(username),password);
   await setDoc(doc(db,"admins",cred.user.uid),{username,role:"admin",createdAt:serverTimestamp()});
   msg.textContent="Admin berhasil dibuat. Hapus/nonaktifkan halaman setup setelah ini, lalu login.";
   form.reset();
 }catch(err){msg.textContent=err.code==="auth/email-already-in-use"?"ID tersebut sudah digunakan.":err.message}
});
