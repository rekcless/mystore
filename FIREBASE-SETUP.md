# Firebase setup NOVA

Config Firebase yang diberikan sudah dipasang di `js/firebase-config.js`.

## Firebase Console
1. Authentication → Sign-in method → aktifkan Email/Password.
2. Authentication → Users → buat user admin.
3. Firestore Database → buat database.
4. Storage → aktifkan bucket.
5. Pastikan Firestore Rules dan Storage Rules mengizinkan user terautentikasi melakukan operasi admin sesuai kebutuhan.

## Jalankan
Gunakan VS Code Live Server atau server HTTP lokal. Jangan buka HTML langsung dengan `file://` karena ES modules/Firebase dapat diblokir browser.

Admin: `pages/admin-login.html`
Dashboard: `pages/admin.html`

Collection produk: `products`

Field produk:
- name
- price
- category
- badge
- image
- description
- stock
- createdAt
- updatedAt

Upload foto akan disimpan di Firebase Storage pada folder `products/`, lalu URL download disimpan pada field `image`.
