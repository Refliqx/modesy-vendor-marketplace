# AGENTS.md — Antigravity Build Instructions
> Panduan kerja untuk Antigravity agent dalam membangun Modesy clone.
> Prioritas utama: efisiensi token, output deterministik, zero re-work, ZERO AI SLOP.
> Status: REPLACE TOTAL v2 — menggabungkan AGENTS.md lama + protokol anti-slop dari spesifikasi tambahan + validasi data/business-rule + Feature Build Order Phase 1-9 penuh.
> **Wajib dibaca berdampingan dengan DESIGN.md. Semua keputusan visual & schema ada di sana — jangan duplikasi, jangan kontradiksi.**

---

## 0. PRINSIP DASAR & ANTI-AI SLOP PROTOCOL

- **Baca DESIGN.md dulu** sebelum menyentuh file apapun yang menyangkut UI atau schema.
- **Jangan tanya yang sudah ada di doc.** Semua keputusan desain & data ada di DESIGN.md. Kalau benar-benar tidak ada → lihat §13 (Validasi & Pertanyaan Wajib) sebelum menebak.
- **Satu tugas = satu scope.** Jangan refactor file lain di luar scope tugas saat ini.
- **Zero-Chatter Rule:** Dilarang menulis kalimat pengantar, basa-basi, atau kesimpulan ("Sure, here is the code", "Let me know if you need changes"). Output kode/diff/command langsung.
- **No Placeholder Code:** Dilarang `// ... rest of the code` atau logic tidak lengkap. Selalu file utuh atau diff standar, production-ready.
- **No Dummy Comments:** Dilarang komentar yang hanya menjelaskan ulang nama variabel/fungsi (`// fungsi ini untuk fetch`). Komentar hanya untuk hal non-obvious (mis. alasan business rule yang tidak terlihat dari kode).
- **No `console.log` debug statements** di kode final.
- **No `// TODO` / `// FIXME`** di kode — kalau ada pekerjaan belum selesai, laporkan di luar kode (chat response), bukan di dalam file.

---

## 1. PROJECT STRUCTURE

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Homepage
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── products/page.tsx           # Listing umum + filter (brand, category, location)
│   │   ├── [categorySlug]/page.tsx     # Category landing (mega-menu target)
│   │   ├── [productSlug]/page.tsx      # PDP
│   │   ├── cart/page.tsx
│   │   ├── wishlist/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── profile/[shopSlug]/page.tsx # Vendor public profile
│   │   ├── blog/page.tsx
│   │   ├── blog/[slug]/page.tsx
│   │   └── auth/callback/route.ts
│   └── api/
│       ├── verify-turnstile/route.ts
│       └── webhooks/
│           └── payment/route.ts        # Phase 8
├── components/
│   ├── layout/
│   │   ├── Topbar.tsx
│   │   ├── Navbar.tsx
│   │   ├── CategoryNav.tsx
│   │   ├── MegaMenu.tsx
│   │   ├── Footer.tsx
│   │   └── CookieConsent.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── LoginModal.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── GoogleAuthButton.tsx
│   │   ├── currency/CurrencyDropdown.tsx
│   │   ├── language/LangDropdown.tsx
│   │   ├── location/LocationModal.tsx
│   │   ├── cart/
│   │   │   ├── CartPage.tsx
│   │   │   ├── CartVendorGroup.tsx
│   │   │   └── CartItemRow.tsx
│   │   ├── wishlist/WishlistButton.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGridSection.tsx
│   │   │   ├── ProductImageSlider.tsx
│   │   │   ├── ProductVariationSelector.tsx
│   │   │   └── ProductReviews.tsx
│   │   └── checkout/CheckoutForm.tsx
│   ├── home/
│   │   ├── HeroCarousel.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── BrandList.tsx
│   │   ├── BlogGrid.tsx
│   │   └── NewsletterBand.tsx
│   └── ui/                             # shadcn/ui primitives
├── actions/                             # Server Actions (WAJIB untuk semua write)
│   ├── cart.actions.ts
│   ├── wishlist.actions.ts
│   ├── review.actions.ts
│   ├── order.actions.ts
│   └── auth.actions.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── auth.ts
│   ├── utils.ts
│   ├── pricing.ts                       # hitung final_price dari base + price_modifier + discount
│   └── category-tree.ts                 # static taxonomy (lihat DESIGN.md §12.15)
├── stores/
│   ├── useAuthModalStore.ts
│   ├── useCurrencyStore.ts
│   ├── useLocationStore.ts
│   └── useCartStore.ts
├── messages/
│   ├── en.json
│   └── ar.json
├── middleware.ts
└── i18n.ts
```

---

## 2. TASK PROTOCOL

Setiap kali menerima tugas dari user, ikuti urutan ini:

```
1. Identifikasi FILE(S) yang akan diubah/dibuat
2. Cek referensi di DESIGN.md (visual/schema) — kalau tugas menyentuh tabel di DESIGN.md §12.10-12.17,
   konfirmasi migration terkait SUDAH dijalankan user (lihat §13 — jangan asumsi)
3. Tulis kode → output langsung tanpa narasi panjang
4. Jika ada dependency baru → tambahkan ke package.json dan sebut sekali
5. Jika perlu env var baru → tambahkan ke .env.example dan sebut sekali
6. Jika tugas melibatkan write ke DB → pastikan lewat Server Action di /actions, bukan inline di komponen
```

---

## 3. TOKEN EFFICIENCY RULES

### 3.1 JANGAN lakukan ini (buang token):
- Jelaskan ulang apa yang akan dikerjakan sebelum kerjakan
- Tampilkan kode lama sebelum kode baru jika tidak diminta
- Tulis `console.log` debug statements
- Tulis komentar `// TODO` atau `// FIXME`
- Tanya ulang hal yang sudah ada jawabannya di DESIGN.md
- Refactor file lain yang bukan target tugas
- Tampilkan semua file yang tidak berubah
- **Melakukan live browser navigation/screenshot ke modesy.codingest.com atau domain manapun untuk "memverifikasi" tampilan** (lihat §14 — larangan eksplisit)

### 3.2 LAKUKAN ini (hemat token):
- Output hanya file yang berubah
- Gunakan `@import` dari `.claude/rules/` (atau setara) untuk rule modular jika tooling mendukung
- Bila hanya 1 baris berubah, tampilkan hanya diff bukan seluruh file
- Gunakan TypeScript type inference, hindari verbose generic
- Gunakan barrel exports (`index.ts`) agar import path pendek

### 3.3 Komponen splitting:
- File > 150 baris → split jadi sub-komponen
- Satu file = satu tanggung jawab
- Logic bisnis → custom hook (`use*.ts`) atau `/lib`, bukan inline di komponen

---

## 4. NAMING CONVENTIONS

| Jenis           | Konvensi          | Contoh                              |
|------------------|---------------------|---------------------------------------|
| Component file   | PascalCase.tsx      | `LoginModal.tsx`                     |
| Hook file        | camelCase.ts        | `useCurrencyStore.ts`                |
| Util file        | camelCase.ts        | `formatCurrency.ts`                  |
| Server Action file | camelCase.actions.ts | `cart.actions.ts`                  |
| Route handler    | route.ts             | `app/api/verify-turnstile/route.ts` |
| Type/interface   | PascalCase           | `type Currency = ...`               |
| Zustand store    | `use[Name]Store`     | `useCurrencyStore`                  |
| CSS class        | Tailwind only         | tidak ada custom class kecuali perlu |

---

## 5. COMPONENT AUTHORING RULES

```tsx
// ✅ BENAR — functional, typed, no comments
export function CurrencyDropdown() {
  const { selected, setSelected } = useCurrencyStore()
  return (...)
}

// ❌ SALAH — default export anonymous, verbose comment
export default function() {
  // This component handles currency selection
  ...
}
```

- Selalu named export kecuali page/layout (Next.js requirement)
- Props interface langsung inline bila < 4 props, pisah bila ≥ 4
- Gunakan `cn()` dari `lib/utils.ts` untuk conditional classNames
- Semua string UI → dari `messages/en.json` / `messages/ar.json` (next-intl `useTranslations`)
- **Read (GET):** Supabase Server Client (`createServerClient`) langsung di Server Components. Gunakan `Promise.all` untuk parallel fetching multi-section homepage.
- **Write (POST/PATCH/DELETE):** WAJIB Server Actions di `/actions`. Tidak ada exception — termasuk add-to-cart dari client component, yang harus invoke Server Action, bukan `supabase.from(...).insert()` langsung di client.

---

## 6. SUPABASE PATTERNS

```ts
import { createBrowserClient } from '@supabase/ssr'   // komponen client-side
import { createServerClient } from '@supabase/ssr'    // Server Components / Route Handlers / Server Actions
```

**Auth flow:**
1. Google OAuth → `supabase.auth.signInWithOAuth()`
2. Callback di `/auth/callback/route.ts` → exchange code → upsert profile
3. Session tersedia via `supabase.auth.getUser()` di server components

**Jangan gunakan:**
- `supabase.auth.getSession()` di server (tidak reliable) → gunakan `getUser()`
- Direct SQL/insert/update di client component — semua write lewat Server Action

**Relational Query Standard:**
Setiap query yang melibatkan tabel terjemahan (`product_translations`, `category_translations`) WAJIB memakai operator `!inner` untuk memfilter bahasa aktif, mencegah row ganda akibat join 1:N tanpa filter.

```ts
const { data } = await supabase
  .from('products')
  .select(`
    id, slug, price, discount_percent,
    product_images(image_url, is_main, row_order),
    product_translations!inner(title)
  `)
  .eq('product_translations.language_id', activeLangId)
```

---

## 7. ENVIRONMENT VARIABLES

```bash
# .env.local (tidak di-commit)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=              # server-only

NEXT_PUBLIC_CF_TURNSTILE_SITEKEY=       # public key untuk widget
CF_TURNSTILE_SECRET=                    # server-only untuk verify

# Phase 8 — pilih SATU gateway, isi sesuai keputusan user (lihat DESIGN.md §17)
STRIPE_SECRET_KEY=                      # server-only, jika pakai Stripe
STRIPE_WEBHOOK_SECRET=                  # server-only, untuk verifikasi signature webhook
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
# atau
MIDTRANS_SERVER_KEY=                    # server-only, jika pakai Midtrans
MIDTRANS_CLIENT_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=

# exchange_rate sudah di tabel currencies Supabase — TIDAK perlu API key eksternal
```

Semua `NEXT_PUBLIC_` variabel aman di client. Yang lain: **server only**.

---

## 8. I18N RULES (next-intl)

**Struktur pesan:**
```json
// messages/en.json
{
  "nav": {
    "contact": "Contact",
    "sellOnModesy": "Sell on Modesy",
    "cart": "Cart",
    "wishlist": "Wishlist",
    "sellNow": "Sell Now",
    "login": "Login",
    "register": "Register",
    "location": "Location"
  },
  "auth": {
    "connectGoogle": "Connect with Google",
    "orWithEmail": "Or register with email",
    "firstName": "First Name",
    "lastName": "Last Name",
    "email": "Email Address",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "termsAgree": "I have read and agree to the",
    "termsLink": "Terms & Conditions",
    "registerBtn": "Register",
    "loginBtn": "Login",
    "forgotPassword": "Forgot Password?",
    "noAccount": "Don't have an account?",
    "hasAccount": "Already have an account?"
  },
  "cart": {
    "title": "Shopping Cart",
    "empty": "Your cart is empty",
    "continueShopping": "Continue Shopping",
    "shippingFor": "Shipping for {shopName}",
    "proceedCheckout": "Proceed to Checkout"
  },
  "product": {
    "addToCart": "Add to Cart",
    "outOfStock": "Out of Stock",
    "requestQuote": "Request a Quote",
    "addedToCart": "Product successfully added to your cart!"
  }
}
```

**RTL Arabic:**
- Ketika locale = `ar`, tambahkan `dir="rtl"` di root layout
- Gunakan `start`/`end` Tailwind logical properties: `ms-`, `me-`, `ps-`, `pe-`
- **Setiap komponen baru yang punya layout asimetris (icon kiri/kanan, float) WAJIB ditest visual mental terhadap RTL sebelum dianggap selesai** — kalau pakai `ml-`/`mr-`/`pl-`/`pr-` absolut, itu bug RTL, ganti ke logical properties.

---

## 9. DATABASE SCHEMA REFERENCE

> Schema lengkap (existing + ekstensi baru) ada di **DESIGN.md Section 12**. Ringkasan akses & fetch pattern siap pakai di bawah ini.

### 9.1 Tables & Ownership

| Table                     | Akses                       | Notes                                                  |
|---------------------------|------------------------------|---------------------------------------------------------|
| `profiles`                | owner (uid=id)               | 1:1 auth.users, auto-created via trigger                |
| `vendors`                 | owner update, public read    | user_id → auth.users                                   |
| `languages`               | public read                  | Seed: `en` (default), `ar`                              |
| `currencies`              | public read                  | Seed: 9 currencies, exchange_rate relatif USD            |
| `categories`              | public read (status=true)    | Translatable via category_translations                  |
| `products`                | public read (non-draft)      | Translatable via product_translations                   |
| `cart_items`              | owner only                   | unique(user_id, product_id)                              |
| `orders` + `order_items`  | owner read                   | order_items joinable via orders, grouped by vendor di UI |
| `product_images`          | public read                  | **PRASYARAT migration §12.10 DESIGN.md**                |
| `product_options` + `product_option_values` | public read | **PRASYARAT migration §12.11 DESIGN.md**                |
| `product_reviews`         | public read, owner write     | **PRASYARAT migration §12.12** — insert hanya jika sudah pernah beli (lihat §13.3) |
| `wishlists`                | owner only                   | **PRASYARAT migration §12.13**, unique(user_id, product_id) |
| `brands`                   | public read (opsional)       | **PRASYARAT migration §12.16 — JANGAN buat tanpa konfirmasi user** |

### 9.2 Key Fetch Patterns

```ts
// Languages — server component
const { data: languages } = await supabase
  .from('languages')
  .select('id, name, code, text_direction')
  .eq('status', true)
  .order('is_default', { ascending: false })

// Currencies — server component
const { data: currencies } = await supabase
  .from('currencies')
  .select('id, name, code, symbol, exchange_rate')
  .eq('status', true)
  .order('is_default', { ascending: false })

// Categories + translation (active language)
const { data: categories } = await supabase
  .from('categories')
  .select('id, slug, image_path, category_translations!inner(name)')
  .eq('status', true)
  .eq('category_translations.language_id', activeLangId)

// Product card data — dengan main image (Phase 6+)
const { data: products } = await supabase
  .from('products')
  .select(`
    id, slug, price, discount_percent, category_id, vendor_id,
    vendors(shop_name, shop_slug),
    product_images(image_url, is_main, row_order),
    product_translations!inner(title, short_description)
  `)
  .eq('status', true)
  .eq('is_draft', false)
  .eq('product_translations.language_id', activeLangId)
  .limit(10)
// resolusi gambar di kode: cari is_main=true, fallback row_order terkecil,
// fallback placeholder picsum jika array product_images kosong (DESIGN.md §4.8)

// Special Offers
.not('discount_percent', 'is', null)

// Featured Products (+ Load More via range/offset)
.eq('is_featured', true)
.range(offset, offset + 9)

// New Arrivals
.order('created_at', { ascending: false })

// Produk per kategori (Clothing, Jewelry & Accessories, dst)
.eq('category_id', categoryId)

// Rating aggregate untuk ProductCard (hanya render jika count > 0)
const { data: reviewAgg } = await supabase
  .from('product_reviews')
  .select('rating')
  .eq('product_id', productId)
// hitung average + count di kode, JANGAN render rating row jika count === 0

// PDP — full image set + options + reviews (parallel fetch)
const [images, options, optionValues, reviews] = await Promise.all([
  supabase.from('product_images').select('*').eq('product_id', id).order('row_order'),
  supabase.from('product_options').select('*').eq('product_id', id),
  supabase.from('product_option_values').select('*').in('option_id', optionIds),
  supabase.from('product_reviews').select('*, profiles(full_name, avatar_url)').eq('product_id', id),
])

// Cek eligibility user untuk submit review (server action, sebelum insert)
const { data: eligible } = await supabase
  .from('order_items')
  .select('id, orders!inner(user_id, payment_status)')
  .eq('product_id', productId)
  .eq('orders.user_id', userId)
  .eq('orders.payment_status', 'paid')
  .limit(1)
// insert review HANYA jika eligible.length > 0

// Wishlist toggle (server action)
await supabase.from('wishlists').upsert(
  { user_id: userId, product_id: productId },
  { onConflict: 'user_id,product_id' }
)

// Cart grouped by vendor — fetch lalu group di kode (bukan di query)
const { data: cartItems } = await supabase
  .from('cart_items')
  .select(`
    id, quantity, product_id,
    products(id, slug, price, vendor_id, vendors(shop_name, shop_slug, shop_logo))
  `)
  .eq('user_id', userId)
// group by products.vendor_id di JS/TS, hitung shipping per grup terpisah

// Upsert profile setelah Google OAuth callback
await supabase.from('profiles').upsert({
  id: user.id,
  full_name: user.user_metadata.full_name ?? '',
  avatar_url: user.user_metadata.avatar_url ?? null,
}, { onConflict: 'id' })
```

### 9.3 TypeScript Types

```ts
import type { Database } from '@/types/supabase'
type Profile            = Database['public']['Tables']['profiles']['Row']
type Currency           = Database['public']['Tables']['currencies']['Row']
type Language           = Database['public']['Tables']['languages']['Row']
type Category           = Database['public']['Tables']['categories']['Row']
type Product            = Database['public']['Tables']['products']['Row']
type ProductImage       = Database['public']['Tables']['product_images']['Row']
type ProductOption      = Database['public']['Tables']['product_options']['Row']
type ProductOptionValue = Database['public']['Tables']['product_option_values']['Row']
type ProductReview      = Database['public']['Tables']['product_reviews']['Row']
type Wishlist           = Database['public']['Tables']['wishlists']['Row']
type CartItem           = Database['public']['Tables']['cart_items']['Row']
type Order              = Database['public']['Tables']['orders']['Row']
type OrderItem          = Database['public']['Tables']['order_items']['Row']
type Vendor             = Database['public']['Tables']['vendors']['Row']
```

Generate ulang types setiap ada perubahan schema:
```bash
npx supabase gen types typescript --project-id <id> > src/types/supabase.ts
```

**Agent WAJIB menanyakan ke user apakah types sudah di-generate ulang sebelum mulai coding terhadap tabel baru di §12.10-12.17 DESIGN.md, jika belum ada bukti di project (lihat §13.1).**

---

## 10. CURRENCY STORE SPEC

```ts
// stores/useCurrencyStore.ts
// Data dari tabel `currencies` Supabase — TIDAK hardcode
// exchange_rate di DB relatif terhadap USD (USD = 1.0)

interface CurrencyStore {
  currencies: Currency[]
  selected: Currency | null
  setCurrencies: (c: Currency[]) => void
  setSelected: (c: Currency) => void
}
```

- Load currencies di root layout (server), pass ke client store initializer
- Format harga: `Intl.NumberFormat(locale, { style: 'currency', currency: selected.code })`
- Persist pilihan currency (cookie/localStorage) — rehydrate store dari situ saat reload
- `NEXT_PUBLIC_EXCHANGE_RATE_API_KEY` tidak diperlukan — rate sudah ada di DB

---

## 11. FEATURE BUILD ORDER (Phase 1–9)

```
Phase 1 — Foundation
  [x] Project setup (next-intl, tailwind, shadcn, zustand, supabase)
  [x] DESIGN.md → tailwind.config.ts tokens
  [x] Layout shell (Topbar, Navbar, CategoryNav)
  [x] Homepage static (Hero Carousel + Category Grid)

Phase 2 — Auth
  [x] Google OAuth (Supabase)
  [x] Register page + form validation (zod)
  [x] Cloudflare Turnstile integration
  [x] Login modal

Phase 3 — Topbar Features
  [x] Currency switcher (9 currencies)
  [x] Language switcher (EN/AR + RTL)
  [x] Location picker (country-state-city) — ⚠️ UPGRADE ke 3 tingkat (Country→State→City), lihat DESIGN.md §4.5. Jika implementasi existing masih 2 tingkat, ini task migrasi UI, bukan task baru dari nol.

Phase 4 — Polish
  [x] Loading states, skeletons
  [x] Error handling & toasts
  [x] Mobile responsive
  [x] SEO (next/metadata)

Phase 5 — Product Sections (Homepage, basic)
  [x] PRASYARAT: migration discount_percent + is_featured, seed dummy products + translations
  [x] ProductCard component (versi basic, placeholder image)
  [x] ProductGridSection component (template)
  [x] Special Offers section
  [x] Featured Products section
  [x] New Arrivals section
  [x] Shop By Category — Clothing section
  [x] Shop By Category — Jewelry & Accessories section
  [x] Verifikasi: ganti currency di topbar → harga di semua section ikut berubah

Phase 6 — Rich Product Data (Images, Variations, Reviews)
  [ ] PRASYARAT (manual user, Supabase SQL Editor — BUKAN tugas agent):
      migration product_images, product_options, product_option_values, product_reviews
      (DESIGN.md §12.10–§12.12) — agent WAJIB konfirmasi ini sudah jalan sebelum mulai (lihat §13.1)
  [ ] Generate ulang TypeScript types setelah migration dikonfirmasi
  [ ] Upgrade `<ProductCard />` — main image dari product_images, rating dari product_reviews
  [ ] `<ProductImageSlider />` (Embla) untuk PDP, col-span-7
  [ ] `<ProductVariationSelector />` — pill/swatch per product_options, hitung final_price live
  [ ] PDP layout 12-kolom penuh (DESIGN.md §4.9)
  [ ] Stock validation per kombinasi variasi (bukan products.stock global jika ada variasi)
  [ ] `<ProductReviews />` — summary + list + form (dengan eligibility check pembelian, §13.3)
  [ ] Wishlist toggle end-to-end (DB + UI heart fill state)
  [ ] Toast "Product successfully added to your cart!" (DESIGN.md §4.12)

Phase 7 — Cart, Wishlist Page & Checkout Architecture
  [ ] PRASYARAT (manual user): migration wishlists (DESIGN.md §12.13) jika belum
  [ ] `/cart` page — multi-vendor grouping (DESIGN.md §4.11), shipping per grup
  [ ] Server Actions: addToCart, updateQty, removeFromCart (semua re-validate stock di server)
  [ ] `/wishlist` page — grid ProductCard dari wishlists user
  [ ] Checkout shipping form (country-state-city untuk alamat pengiriman, BUKAN sama dengan location filter topbar — entitas berbeda)
  [ ] Order drafting: insert ke `orders` + `order_items` (status pending) sebelum redirect ke payment

Phase 8 — Payment Gateway Integration
  [ ] PRASYARAT: keputusan user Stripe vs Midtrans (lihat §13.4 — WAJIB tanya, jangan asumsi)
  [ ] PRASYARAT (manual user): migration kolom payment di orders (DESIGN.md §12.14)
  [ ] Payment intent/session creation di server action saat "Place Order"
  [ ] Webhook handler `/api/webhooks/payment/route.ts` — verifikasi signature WAJIB sebelum update payment_status
  [ ] Reconciliation: update order_items.order_status setelah payment_status = 'paid'
  [ ] Halaman konfirmasi order (`/order/[orderNumber]` atau setara)

Phase 9 — Vendor Dashboard & Admin Controls
  [ ] Vendor dashboard: CRUD produk milik sendiri (RLS by vendor_id = current user's vendor)
  [ ] Vendor: lihat order_items masuk untuk produknya, update tracking_number
  [ ] Vendor: lihat balance & earning (dari order_items.vendor_earning)
  [ ] Admin dashboard: approve/reject vendor (vendors.is_verified, status)
  [ ] Admin: moderasi produk (products.status, is_draft)
  [ ] Admin: lihat semua orders lintas vendor
  [ ] RLS audit menyeluruh sebelum Phase 9 dianggap selesai — pastikan vendor TIDAK bisa baca/edit produk vendor lain
```

---

## 12. COMMON PITFALLS — HINDARI

| Masalah                          | Solusi                                                       |
|------------------------------------|-----------------------------------------------------------------|
| Hydration mismatch                | Pastikan state dari zustand ada `_hasHydrated` guard            |
| Google Auth redirect loop         | Cek `/auth/callback` handler sudah benar                       |
| Turnstile token expired           | Reset widget (key baru) setiap submit gagal                    |
| RTL layout breakage               | Gunakan logical properties (`ms-`/`me-`), test mental setiap layout baru |
| Currency rate stale               | Rate dari DB `currencies`, bukan API — refresh saat admin update tabel, bukan polling client |
| `useSearchParams` SSR error       | Wrap dengan `<Suspense>`                                       |
| shadcn dialog + framer conflict   | Gunakan satu saja, jangan mix                                  |
| Stock race condition saat checkout | Re-validate stock di server action SEBELUM insert order_items, bukan hanya percaya client state |
| Review tanpa beli                 | Cek eligibility (order_items + payment_status='paid') di server, bukan hanya sembunyikan tombol di UI |
| Webhook payment tanpa verifikasi signature | WAJIB verify signature (Stripe/Midtrans) sebelum update payment_status — payload tanpa verifikasi = celah fraud |
| Cart vendor grouping di DB        | Grouping dilakukan di kode (JS/TS), JANGAN tambah kolom redundant di cart_items untuk grouping |
| Product image kosong              | Selalu fallback placeholder picsum jika product_images kosong — jangan render `<img src={undefined}>` |
| Variation stock vs product stock  | Jika produk punya product_options, validasi qty terhadap stock di product_option_values, bukan products.stock |

---

## 13. VALIDASI & PERTANYAAN WAJIB (PRE-FLIGHT CHECKS)

> Bagian ini baru. Tujuannya: cegah agent menebak hal yang berdampak besar (schema, business rule, keamanan) tanpa konfirmasi user — sekaligus cegah agent bertanya hal yang **sudah** terjawab di DESIGN.md.

### 13.1 Sebelum mulai task yang menyentuh tabel di DESIGN.md §12.10–§12.17
- **WAJIB tanya user:** "Migration [nama tabel] di DESIGN.md §12.X sudah dijalankan di Supabase SQL Editor?" — jangan asumsi ya/tidak.
- Jika belum, agent BERHENTI dan tidak menulis kode yang query tabel tersebut. Sarankan jalankan migration dulu.
- Jika sudah, **WAJIB tanya:** "Types TypeScript sudah di-generate ulang (`supabase gen types`)?" — jika belum, agent generate dulu instruksi command-nya, jangan menulis kode yang asumsi shape type lama.

### 13.2 Sebelum membuat/mengubah RLS Policy
- **WAJIB tampilkan policy yang akan ditambahkan ke user sebelum menyarankan dijalankan** — jangan langsung asumsi policy lama di DESIGN.md cukup untuk kasus baru tanpa cek ulang.
- Setiap tabel baru WAJIB punya RLS enabled + minimal 1 policy SELECT sebelum dianggap "selesai". Tabel tanpa RLS adalah open access — flag ini sebagai blocking issue, bukan catatan minor.

### 13.3 Sebelum implementasi fitur dengan business rule implisit
Contoh yang WAJIB dikonfirmasi (bukan diasumsikan):
- Review hanya boleh dari pembeli yang sudah `payment_status = 'paid'` DAN/ATAU `order_status = 'delivered'`? (DESIGN.md §12.12 menyarankan 'paid', tapi user bisa mau lebih strict ke 'delivered' — **tanya kalau ambigu, jangan pilih sendiri lalu diam-diam beda dari ekspektasi user**)
- 1 user boleh review 1 produk lebih dari sekali (re-order)? Default rekomendasi: tidak (unique constraint), tapi WAJIB konfirmasi sebelum menambah constraint ke migration.
- Stock kombinasi variasi: apakah price_modifier & stock dihitung per-option-value (default schema saat ini, lihat catatan keterbatasan DESIGN.md §12.11) sudah cukup, atau user butuh SKU per-kombinasi presisi (butuh tabel tambahan)?

### 13.4 Sebelum Phase 8 (Payment) dimulai
- **WAJIB tanya:** "Pakai Stripe atau Midtrans?" — JANGAN pilih default sendiri tanpa bertanya, walau DESIGN.md §17 menyebut Stripe sebagai rekomendasi jika user tidak spesifik. Rekomendasi itu hanya fallback kalau user benar-benar tidak punya preferensi setelah ditanya, bukan pengganti pertanyaan.
- **WAJIB tanya:** apakah sudah ada akun/API key sandbox Stripe atau Midtrans yang siap dipakai, atau perlu disiapkan dulu di luar sesi agent.

### 13.5 Validasi keamanan menyeluruh (jalankan checklist ini sebelum klaim sebuah Phase "selesai")
- [ ] Semua tabel baru punya RLS enabled
- [ ] Semua Server Action yang menulis data melakukan re-check authorization (bukan hanya percaya `user_id` dari client payload — ambil dari `supabase.auth.getUser()` di server, JANGAN dari parameter yang dikirim client)
- [ ] Semua input form punya validasi zod di server, tidak hanya di client (client-side validation bisa di-bypass)
- [ ] Tidak ada service role key (`SUPABASE_SERVICE_ROLE_KEY`) yang ter-expose ke client bundle
- [ ] Webhook payment (Phase 8) memverifikasi signature sebelum memproses payload

### 13.6 Kapan agent BOLEH menebak vs HARUS bertanya
- **Boleh menebak (lalu state asumsi secara eksplisit di response, bukan di kode):** detail visual kecil yang tidak ada di DESIGN.md tapi konsisten dengan token yang ada (mis. warna hover state baru yang belum didefinisikan — pakai pola existing).
- **Harus bertanya:** apapun yang menyangkut schema baru, business rule finansial (commission, shipping calculation, refund), payment gateway, atau RLS policy yang melonggarkan akses.

---

## 14. LARANGAN LIVE BROWSER CHECKING

> **Agent (Antigravity) DILARANG KERAS melakukan live browser navigation, screenshot, atau scraping ke modesy.codingest.com — atau domain manapun — untuk tujuan "memverifikasi" tampilan, membandingkan pixel, atau mengambil ulang konten.**

- Semua kebutuhan visual, struktur konten, copy text, dan urutan section sudah didokumentasikan penuh di DESIGN.md (hasil inspeksi yang sudah dilakukan terpisah dari sesi build).
- Jika agent merasa ada detail yang kurang, **tanyakan ke user dalam bentuk teks**, JANGAN browsing sendiri ke situs referensi atau situs manapun untuk mencari tahu.
- Verifikasi kemiripan 99% terhadap situs asli adalah **tanggung jawab manual user**, dilakukan di luar sesi agent, dengan membandingkan build lokal terhadap referensi sendiri.
- Pengecualian satu-satunya: agent boleh menjalankan aplikasi lokal (`npm run dev`) dan melihat output di lingkungan sandbox/headless milik agent sendiri untuk keperluan debugging teknis (error rendering, exception), **bukan** untuk perbandingan visual terhadap situs asli.
- Larangan ini berlaku permanen untuk seluruh sisa proyek (Phase 1-9 dan seterusnya), tidak hanya task tertentu.

---

## 15. QUICK REFERENCE — DESIGN TOKENS

```
Primary color:     #0BAF9A
Primary hover:     #099D8A
Topbar bg:         #1B2333
Footer bg:         #1B2333
Border:            #E5E7EB
Text main:         #1F2937
Text muted:        #6B7280
Placeholder:       #9CA3AF
Discount badge:    #EF4444
Input height:      52px
Nav height:        64px
Topbar height:     40px
Category nav h:    48px
Border radius:     6px (inputs/buttons), 8px (cards), 12px (modal)
Font:              Inter
```

---

## 16. PROMPT EKSEKUSI UNTUK ANTIGRAVITY

> Salin blok di bawah ini sebagai system/initial prompt saat membuka sesi baru Antigravity untuk proyek ini. Tidak perlu modifikasi kecuali task spesifik berubah.

```
ROLE SPECIFICATION:
You are a Senior Fullstack Web Engineer specializing in Next.js 14 (App Router),
TailwindCSS v3, and Supabase SSR. You operate under absolute deterministic
constraints. You must execute your tasks according to the rules defined in
AGENTS.md and the visual/data specs in DESIGN.md, both located at the project root.

CURRENT TASK CONTEXT:
We are building a 99% accurate clone of the Modesy multi-vendor marketplace.
Phases 1-5 (foundation, auth, topbar features, polish, basic product sections)
are already complete in this project. We are now continuing from Phase 6 onward
(rich product data: images, variations, reviews — then cart/checkout, payment,
vendor/admin dashboards), per AGENTS.md §11.

EXECUTION INSTRUCTIONS (ANTI-AI SLOP PROTOCOL):
1. ZERO CHATTER: Do not write prefaces, introductions, or conclusions. Do not say
   "Sure, here is the code" or "Let me know if you need changes."
2. DIRECT OUTPUT: Output ONLY the requested code, git diffs, or necessary terminal
   commands.
3. NO PLACEHOLDERS: Do not use `// ... rest of the code` or leave incomplete logic.
   Deliver production-ready, complete blocks.
4. STRICT TYPING: Always use the auto-generated Database types from
   `@/types/supabase`. If a task touches a table added in DESIGN.md §12.10-12.17,
   STOP and ask whether the migration has been run and types regenerated —
   do not assume.
5. SCOPE ISOLATION: Do not refactor files outside the explicitly requested scope.
6. WRITES VIA SERVER ACTIONS ONLY: Any insert/update/delete must go through a
   Server Action in /actions, never inline in a client component.
7. SECURITY PRE-FLIGHT: Before marking any task complete, run the checklist in
   AGENTS.md §13.5 (RLS enabled, server-side auth re-check, server-side zod
   validation, no exposed service role key, webhook signature verification
   where relevant).
8. NO LIVE BROWSER CHECKING: You are strictly forbidden from navigating to,
   screenshotting, or scraping modesy.codingest.com or any other live website
   to "verify" visual output. All required visual/content specs already exist
   in DESIGN.md. If something seems missing, ASK the user in text — do not
   browse to find out. Pixel-comparison verification against the reference
   site is done manually by the user, outside of your session.
9. ASK BEFORE GUESSING ON: new schema/migrations, financial business rules
   (commission, shipping, refunds), payment gateway choice, or any RLS policy
   that loosens access. You MAY proceed without asking on minor visual details
   not covered by DESIGN.md, as long as you state the assumption in your
   response text (not in code comments).

PHASE EXECUTION PLAN (see AGENTS.md §11 for full checklist):
- Phase 1-5: COMPLETE.
- Phase 6: Product images, variations, reviews — upgrade ProductCard, build PDP.
- Phase 7: Cart multi-vendor grouping, wishlist page, checkout drafting.
- Phase 8: Payment gateway integration (Stripe or Midtrans — ASK which one
  before starting), webhook reconciliation at /api/webhooks/payment/route.ts.
- Phase 9: Vendor dashboard & Admin controls, full RLS audit.

Acknowledge your understanding of these boundaries by printing ONLY the text:
"[MODESY_CLONE_ENGINEER_ONLINE_AND_READY]". Do not output a single word more.
```

---

*Antigravity harus merujuk file ini + DESIGN.md di setiap sesi sebelum memulai tugas baru. File ini adalah replace total dari versi sebelumnya — jangan campur dengan instruksi versi lama yang mungkin masih ter-cache di memori agent.*