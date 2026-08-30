import { auth, signInWithEmailAndPassword } from "./firebase-admin.js";

const form=document.querySelector("#login-form"), error=document.querySelector("#error");
const usernameToInternalEmail = username => `${username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "") || "admin"}@nova-admin.com`;

form.addEventListener("submit",async e=>{
  e.preventDefault(); error.textContent="";
  const username=document.querySelector("#username").value.trim();
  const password=document.querySelector("#password").value;
  if(username.length<3){error.textContent="ID admin minimal 3 karakter.";return}
  try{
    await signInWithEmailAndPassword(auth, usernameToInternalEmail(username), password);
    location.href="admin.html";
  }catch(err){
    error.textContent="ID atau password salah. Pastikan akun admin sudah dibuat.";
  }
});
