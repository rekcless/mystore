# NOVA Store — Frontend + Backend + PostgreSQL

Versi 3: frontend toko + Admin Dashboard + backend API.

## Struktur
- `index.html` — storefront
- `pages/admin.html` — admin CRUD
- `js/` — frontend logic
- `server/` — Node.js + Express + Prisma API
- `server/prisma/schema.prisma` — database schema

## Quick start backend
1. Install PostgreSQL dan buat database `nova_store`.
2. Masuk ke folder `server`.
3. Salin `.env.example` menjadi `.env` dan sesuaikan `DATABASE_URL`.
4. Jalankan:
   - `npm install`
   - `npx prisma generate`
   - `npx prisma migrate dev --name init`
   - `npm run prisma:seed`
   - `npm run dev`
5. Buka `index.html` atau gunakan Live Server.
6. Admin: `pages/admin.html`.

Admin sekarang membaca/menulis produk lewat API PostgreSQL, bukan localStorage.

## Tahap berikutnya
Auth admin, orders, customers, image upload, stock transactions, payment gateway, validation/security production.
