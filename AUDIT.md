# AUDIT.md — Checklist Audit Manual Modesy Clone
> Isi sendiri checklist ini sambil cek project Anda di browser & code editor.
> Cara pakai: buka project di satu tab, modesy.codingest.com di tab lain, lalu cocokkan satu-satu.
> Tandai: ✅ Sudah ada & sesuai · 🟡 Ada tapi belum sempurna · ❌ Belum ada · — Tidak relevan/skip
> Acuan: DESIGN.md (visual/data) & AGENTS.md §11 (Feature Build Order)

---

## CARA AUDIT YANG BENAR

1. Untuk setiap baris, buka halaman terkait di project Anda.
2. Bandingkan dengan deskripsi singkat di kolom "Cek".
3. Kalau ragu apakah sudah "sesuai spec", buka bagian DESIGN.md yang dirujuk di kolom terakhir.
4. Jangan cuma cek "ada tombolnya" — cek juga apakah fungsinya jalan (klik, submit, lihat hasil di DB kalau perlu).
5. Tulis catatan singkat di kolom Notes kalau ada bug/setengah jadi, supaya jadi backlog otomatis.

---

## PHASE 1 — FOUNDATION

| # | Fitur | Cek | Status | Notes |
|---|---|---|---|---|
| 1.1 | Topbar tampil & sticky | Contact, Sell on Modesy, Location, Currency, Language, Login/Register semua ada | | |
| 1.2 | Navbar logo "Modesy" warna benar | "M" gelap, "o" teal #0BAF9A | | |
| 1.3 | Search bar fungsional | Ketik query → ada hasil/redirect (boleh placeholder kalau search belum Phase ini) | | |
| 1.4 | Cart & Wishlist icon tampil di navbar | Termasuk badge angka jika ada item | | |
| 1.5 | Sell Now button | Warna teal, hover berubah ke #099D8A | | |
| 1.6 | Category Nav bar 8 kategori | Clothing, Shoes, Home & Living, Jewelry & Accessories, Toys & Entertainment, Graphics & Photos, Video & Audio, Web Templates & Code | | |
| 1.7 | Hero Carousel jalan otomatis | Auto-slide, ada arrow & dots, klik dots pindah slide | | |
| 1.8 | Shop By Category grid | Circle image, hover scale + overlay "Shop Now" | | |
| 1.9 | Tailwind tokens sesuai DESIGN.md §1 | Cek warna primary, topbar bg, border di devtools | | |

---

## PHASE 2 — AUTH

| # | Fitur | Cek | Status | Notes |
|---|---|---|---|---|
| 2.1 | Google OAuth login | Klik "Connect with Google" → redirect → balik dengan session aktif | | |
| 2.2 | Register page `/register` | Semua field ada: First Name, Last Name, Email, Password, Confirm Password | | |
| 2.3 | Validasi form register | Coba submit kosong → muncul error per field | | |
| 2.4 | Email unik dicek | Daftar dengan email yang sudah ada → muncul error, bukan crash | | |
| 2.5 | Cloudflare Turnstile muncul | Widget checkmark hijau "Success!" sebelum submit aktif | | |
| 2.6 | Turnstile reset setelah gagal | Submit gagal → coba lagi → widget tidak pakai token basi | | |
| 2.7 | Login Modal (bukan halaman terpisah) | Klik "Login" di topbar → modal overlay muncul, bukan redirect | | |
| 2.8 | Login modal: pesan error generik | Salah password → pesan "Email or password is incorrect" (tidak bocor mana yang salah) | | |
| 2.9 | Trigger auto-create profile | Setelah signup, cek tabel `profiles` — ada row baru otomatis | | |

---

## PHASE 3 — TOPBAR FEATURES

| # | Fitur | Cek | Status | Notes |
|---|---|---|---|---|
| 3.1 | Currency switcher — 9 currency | USD, EUR, BRL, GBP, IDR, INR, NGN, RUB, TRY semua muncul di dropdown | | |
| 3.2 | Ganti currency → harga ikut berubah | Ganti ke IDR di topbar → cek SEMUA section produk di homepage ikut berubah formatnya | | |
| 3.3 | Currency persist setelah reload | Pilih EUR, refresh halaman → masih EUR (bukan balik ke USD) | | |
| 3.4 | Language switcher EN/AR | Dropdown muncul 2 bahasa dengan flag | | |
| 3.5 | RTL aktif saat pilih Arabic | `dir="rtl"` di html, layout terbalik (bukan cuma teks Arab di layout LTR) | | |
| 3.6 | **Location picker 3 tingkat** | Country → State → **City** (BUKAN cuma 2 tingkat — ini koreksi penting dari spec lama) | | |
| 3.7 | Location tersimpan & tampil di topbar | Format "📍 {City/State}, {Country code}" | | |

---

## PHASE 4 — POLISH

| # | Fitur | Cek | Status | Notes |
|---|---|---|---|---|
| 4.1 | Loading skeleton saat fetch produk | Bukan blank putih/spinner generik, ada shape skeleton card | | |
| 4.2 | Toast error untuk network fail | Matikan internet sebentar → coba aksi → muncul toast error, bukan diam saja | | |
| 4.3 | Mobile responsive — topbar | Topbar items disembunyikan/masuk drawer di < 640px | | |
| 4.4 | Mobile responsive — category grid | 2 kolom di mobile, 3 di tablet, 6 di desktop | | |
| 4.5 | Mobile responsive — product grid | 2 kolom mobile, 3 tablet, 5 desktop | | |
| 4.6 | SEO meta tags | View page source — ada `<title>`, `<meta description>` per halaman, bukan generic "Next.js App" | | |

---

## PHASE 5 — PRODUCT SECTIONS (HOMEPAGE)

| # | Fitur | Cek | Status | Notes |
|---|---|---|---|---|
| 5.1 | Special Offers section | Hanya tampil produk dengan `discount_percent` terisi, badge "-X%" merah top-left | | |
| 5.2 | Featured Products section | Hanya `is_featured = true` | | |
| 5.3 | New Arrivals section | Urut dari produk terbaru — cek `created_at` berbeda-beda, bukan identik semua | | |
| 5.4 | Shop By Category — Clothing | Grid produk filter kategori clothing | | |
| 5.5 | Shop By Category — Jewelry & Accessories | Grid produk filter kategori jewelry | | |
| 5.6 | "View All →" link | Klik → tidak 404, minimal ke `/products` dengan filter relevan | | |
| 5.7 | Product Card: harga normal vs diskon | Diskon → harga asli strikethrough + harga setelah diskon bold teal | | |
| 5.8 | Product Card: vendor/shop name tampil | Mis. "Trendshop", "Admin" — bukan kosong | | |

---

## PHASE 6 — RICH PRODUCT DATA (Images, Variations, Reviews)

> Cek dulu: apakah migration `product_images`, `product_options`, `product_option_values`, `product_reviews` sudah ada di Supabase Table Editor sebelum lanjut audit baris di bawah.

| # | Fitur | Cek | Status | Notes |
|---|---|---|---|---|
| 6.1 | Tabel `product_images` ada di Supabase | Table Editor → cari nama tabel | | |
| 6.2 | Gambar produk BUKAN placeholder picsum | Buka beberapa produk — apakah masih `picsum.photos` atau sudah gambar asli/relevan | | |
| 6.3 | Tabel `product_options` + `product_option_values` ada | Table Editor | | |
| 6.4 | PDP — halaman detail produk ada | Klik salah satu produk dari homepage → masuk ke halaman detail (bukan 404) | | |
| 6.5 | PDP — layout 12 kolom (gambar kiri, info kanan) | Bukan stack vertikal sederhana | | |
| 6.6 | PDP — image slider (Embla carousel) | Bisa swipe/klik arrow ganti gambar, ada thumbnail strip | | |
| 6.7 | PDP — variation selector (Color/Size dll) | Kalau produk punya varian, ada pilihan klik | | |
| 6.8 | PDP — harga berubah live saat ganti varian | Pilih varian dengan price_modifier → harga update tanpa reload | | |
| 6.9 | PDP — stock validation | Pilih qty > stock tersedia → tombol disable / muncul peringatan | | |
| 6.10 | PDP — tombol "Out of Stock" saat stock 0 | Bukan tetap "Add to Cart" aktif | | |
| 6.11 | Tabel `product_reviews` ada | Table Editor | | |
| 6.12 | Review section di PDP | Rating summary + list review tampil (kalau ada datanya) | | |
| 6.13 | Rating bintang di Product Card | Hanya tampil jika produk punya review (bukan "0 reviews" kosong) | | |
| 6.14 | Form submit review hanya untuk pembeli | Coba akses sebagai user yang belum pernah beli — form review TIDAK boleh muncul/submit sukses | | |
| 6.15 | Wishlist toggle berfungsi nyata | Klik hati di card/PDP → cek tabel `wishlists` di Supabase, ada row baru | | |
| 6.16 | Wishlist heart icon berubah state | Sudah di-wishlist → ikon jadi filled merah, bukan tetap outline | | |
| 6.17 | Toast "Product successfully added to your cart!" | Klik Add to Cart → toast muncul kanan atas/bawah, auto-dismiss | | |

---

## PHASE 7 — CART, WISHLIST PAGE & CHECKOUT

| # | Fitur | Cek | Status | Notes |
|---|---|---|---|---|
| 7.1 | Halaman `/cart` ada | Klik ikon cart di navbar → masuk halaman cart | | |
| 7.2 | **Cart dikelompokkan per vendor** | Kalau ada produk dari 2 vendor berbeda di cart, harus ada 2 header grup terpisah | | |
| 7.3 | Shipping cost terpisah per grup vendor | Bukan 1 ongkir gabungan semua vendor | | |
| 7.4 | Update qty di cart | Ubah angka qty → subtotal & total ikut berubah | | |
| 7.5 | Hapus item dari cart | Klik X/hapus → item hilang, total update | | |
| 7.6 | Cart persist setelah reload | Refresh halaman cart → item tidak hilang (tersimpan di DB, bukan cuma local state) | | |
| 7.7 | Empty state cart | Cart kosong → ada ilustrasi + "Continue Shopping" | | |
| 7.8 | Halaman `/wishlist` ada | Klik ikon wishlist di navbar → masuk halaman wishlist | | |
| 7.9 | Wishlist page render produk yang di-save | Bukan halaman kosong/placeholder | | |
| 7.10 | Form checkout — alamat pengiriman | Country/State/City untuk shipping ADDRESS (beda dari Location filter topbar) | | |
| 7.11 | Order draft tersimpan sebelum payment | Submit checkout → cek tabel `orders` & `order_items`, status "pending" | | |

---

## PHASE 8 — PAYMENT GATEWAY

> ⚠️ Sebelum audit ini, pastikan sudah ada keputusan: Stripe atau Midtrans? Kalau belum diputuskan, semua baris di bawah wajar masih ❌.

| # | Fitur | Cek | Status | Notes |
|---|---|---|---|---|
| 8.1 | Payment gateway sudah dipilih & terkonfigurasi | Env var terisi (`STRIPE_SECRET_KEY` atau `MIDTRANS_SERVER_KEY`) | | |
| 8.2 | Klik "Place Order" → redirect ke payment | Stripe Checkout / Midtrans Snap muncul | | |
| 8.3 | Pembayaran sukses (sandbox/test mode) → update status | Cek `orders.payment_status` jadi 'paid' setelah bayar test | | |
| 8.4 | Webhook menerima notifikasi | Cek log server / Stripe CLI / Midtrans dashboard — webhook ter-trigger | | |
| 8.5 | **Webhook verifikasi signature** | Ini WAJIB — cek kode `/api/webhooks/payment/route.ts`, ada `constructEvent` (Stripe) atau verifikasi signature key (Midtrans) | | |
| 8.6 | Halaman konfirmasi order | Setelah bayar sukses → ada halaman "Order Confirmed" dengan nomor order | | |

---

## PHASE 9 — VENDOR DASHBOARD & ADMIN

| # | Fitur | Cek | Status | Notes |
|---|---|---|---|---|
| 9.1 | Vendor dashboard ada | Login sebagai vendor → ada menu/halaman dashboard terpisah dari buyer | | |
| 9.2 | Vendor bisa CRUD produk sendiri | Tambah/edit/hapus produk → cek hanya produk milik vendor itu yang bisa diubah | | |
| 9.3 | **Vendor TIDAK bisa edit produk vendor lain** | Coba akses/edit produk vendor lain via URL langsung — harus ditolak (RLS) | | |
| 9.4 | Vendor lihat order masuk | Order yang mengandung produk vendor ini tampil di dashboard vendor | | |
| 9.5 | Vendor update tracking number | Input tracking number di order_items miliknya | | |
| 9.6 | Vendor lihat balance/earning | Angka dari `vendor_earning` di order_items ter-summary | | |
| 9.7 | Admin dashboard ada | Login sebagai admin (role='admin') → ada panel berbeda | | |
| 9.8 | Admin approve/reject vendor | Toggle `vendors.is_verified` / `status` | | |
| 9.9 | Admin moderasi produk | Toggle `products.status` / `is_draft` dari sisi admin | | |
| 9.10 | Admin lihat semua order lintas vendor | Bukan hanya order miliknya sendiri | | |

---

## ELEMEN KONTEN HOMEPAGE (sering terlewat — ditemukan saat inspeksi situs asli)

| # | Fitur | Cek | Status | Notes |
|---|---|---|---|---|
| C.1 | **Mega-menu kategori saat hover** | Hover salah satu kategori di Category Nav → muncul dropdown multi-kolom sub-kategori, BUKAN flat link biasa | | |
| C.2 | Banner Promo di antara section | Ada 2 banner image side-by-side, minimal 1× di homepage | | |
| C.3 | **Shop By Brand section** | List/chip 16 brand (Adidas, Nike, Gucci, dst) | | |
| C.4 | Brand filter berfungsi | Klik nama brand → halaman produk terfilter, bukan kosong (cek `brand_id` di produk sudah terisi) | | |
| C.5 | **Latest Blog Posts section** | Grid 4 kolom, minimal beberapa post (boleh dummy/statis dulu) | | |
| C.6 | Newsletter band (full-width) | Input email + tombol Subscribe, sebelum footer | | |
| C.7 | Footer 5 kolom lengkap | Brand+social, Categories, Quick Links, Information, Newsletter | | |
| C.8 | Footer — payment method icons | Visa, Mastercard, dst di bottom bar | | |
| C.9 | Footer — copyright tahun dinamis | Pakai `new Date().getFullYear()`, bukan hardcode tahun | | |
| C.10 | **Cookie consent banner** | Muncul di pertama kali buka situs, bisa di-dismiss & tidak muncul lagi | | |

---

## RINGKASAN SETELAH AUDIT SELESAI

Setelah semua baris di atas diisi, hitung manual:

- Total ❌ di Phase 1-5: ___ (idealnya 0, karena ditandai selesai di AGENTS.md)
- Total ❌ di Phase 6: ___ / 17
- Total ❌ di Phase 7: ___ / 11
- Total ❌ di Phase 8: ___ / 6
- Total ❌ di Phase 9: ___ / 10
- Total ❌ di Elemen Konten Homepage: ___ / 10

**Gunakan hasil ini sebagai instruksi task berikutnya ke Antigravity** — sebutkan nomor baris yang ❌/🟡 secara spesifik (mis. "kerjakan 6.2, 6.6, 6.9 dari AUDIT.md") supaya agent tidak menebak scope, sesuai prinsip AGENTS.md §0.