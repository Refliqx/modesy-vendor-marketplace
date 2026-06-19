# AGENTS.md — Antigravity Build Instructions
> Panduan kerja untuk Antigravity agent dalam membangun Modesy clone.
> Prioritas utama: efisiensi token, output deterministik, zero re-work.

---

## 0. PRINSIP DASAR

- **Baca DESIGN.md dulu** sebelum menyentuh file apapun yang menyangkut UI.
- **Jangan tanya yang sudah ada di doc.** Semua keputusan desain ada di DESIGN.md.
- **Satu tugas = satu scope.** Jangan refactor di luar scope tugas saat ini.
- **Tulis kode langsung.** Tidak perlu menjelaskan panjang lebar sebelum kode.
- **Tidak ada komentar kode** kecuali diminta eksplisit.

---

## 1. PROJECT STRUCTURE

```
src/
├── app/
│   ├── [locale]/               # next-intl locale routing
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Homepage
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts    # Supabase OAuth callback
│   └── api/
│       └── verify-turnstile/
│           └── route.ts        # Cloudflare Turnstile server validation
├── components/
│   ├── layout/
│   │   ├── Topbar.tsx
│   │   ├── Navbar.tsx
│   │   ├── CategoryNav.tsx
│   │   └── Footer.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── LoginModal.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── GoogleAuthButton.tsx
│   │   ├── currency/
│   │   │   └── CurrencyDropdown.tsx
│   │   ├── language/
│   │   │   └── LangDropdown.tsx
│   │   └── location/
│   │       └── LocationModal.tsx
│   ├── home/
│   │   ├── HeroCarousel.tsx
│   │   └── CategoryGrid.tsx
│   └── ui/                     # shadcn/ui primitives
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # createBrowserClient
│   │   └── server.ts           # createServerClient
│   ├── auth.ts
│   └── utils.ts
├── stores/
│   ├── useAuthModalStore.ts    # open/close login modal
│   ├── useCurrencyStore.ts     # selected currency + rates
│   └── useLocationStore.ts     # selected country + state
├── messages/
│   ├── en.json
│   └── ar.json
├── middleware.ts               # next-intl middleware
└── i18n.ts
```

---

## 2. TASK PROTOCOL

Setiap kali menerima tugas dari user, ikuti urutan ini:

```
1. Identifikasi FILE(S) yang akan diubah/dibuat
2. Cek apakah ada referensi di DESIGN.md
3. Tulis kode → output langsung tanpa narasi panjang
4. Jika ada dependency baru → tambahkan ke package.json dan sebut sekali
5. Jika perlu env var baru → tambahkan ke .env.example dan sebut sekali
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

### 3.2 LAKUKAN ini (hemat token):
- Output hanya file yang berubah
- Gunakan `@import` dari `.claude/rules/` untuk rule modular
- Bila hanya 1 baris berubah, tampilkan hanya diff bukan seluruh file
- Gunakan TypeScript type inference, hindari verbose generic
- Gunakan barrel exports (`index.ts`) agar import path pendek

### 3.3 Komponen splitting:
- File > 150 baris → split jadi sub-komponen
- Satu file = satu tanggung jawab
- Logic bisnis → custom hook (`use*.ts`), bukan inline di komponen

---

## 4. NAMING CONVENTIONS

| Jenis               | Konvensi               | Contoh                      |
|---------------------|------------------------|-----------------------------|
| Component file      | PascalCase.tsx         | `LoginModal.tsx`            |
| Hook file           | camelCase.ts           | `useCurrencyStore.ts`       |
| Util file           | camelCase.ts           | `formatCurrency.ts`         |
| Route handler       | route.ts               | `app/api/verify-turnstile/route.ts` |
| Type/interface      | PascalCase             | `type Currency = ...`       |
| Zustand store       | `use[Name]Store`       | `useCurrencyStore`          |
| CSS class           | Tailwind only          | tidak ada custom class kecuali perlu |

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

---

## 6. SUPABASE PATTERNS

```ts
// Browser client — untuk komponen client-side
import { createBrowserClient } from '@supabase/ssr'

// Server client — untuk Server Components / Route Handlers
import { createServerClient } from '@supabase/ssr'
```

**Auth flow:**
1. Google OAuth → `supabase.auth.signInWithOAuth()`
2. Callback di `/auth/callback/route.ts` → exchange code → upsert profile
3. Session tersedia via `supabase.auth.getUser()` di server components

**Jangan gunakan:**
- `supabase.auth.getSession()` di server (tidak reliable) → gunakan `getUser()`
- Direct SQL di client component

---

## 7. ENVIRONMENT VARIABLES

```bash
# .env.local (tidak di-commit)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # server-only

NEXT_PUBLIC_CF_TURNSTILE_SITEKEY=  # public key untuk widget
CF_TURNSTILE_SECRET=               # server-only untuk verify
# exchange_rate sudah di tabel currencies Supabase — tidak perlu API key eksternal
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
  }
}
```

**RTL Arabic:**
- Ketika locale = `ar`, tambahkan `dir="rtl"` di root layout
- Gunakan `start`/`end` Tailwind logical properties: `ms-`, `me-`, `ps-`, `pe-`

---

## 9. DATABASE SCHEMA REFERENCE

> Schema lengkap ada di **DESIGN.md Section 12**. Ini ringkasan yang perlu diingat agent.

### Tables & Ownership

| Table                    | Akses                       | Notes                                           |
|--------------------------|-----------------------------|-------------------------------------------------|
| `profiles`               | owner (uid=id)              | 1:1 auth.users, auto-created via trigger        |
| `vendors`                | owner update, public read   | user_id → auth.users                            |
| `languages`              | public read                 | Seed: `en` (default), `ar`                     |
| `currencies`             | public read                 | Seed: 9 currencies, exchange_rate relatif USD   |
| `categories`             | public read (status=true)   | Translatable via category_translations          |
| `products`               | public read (non-draft)     | Translatable via product_translations           |
| `cart_items`             | owner only                  | unique(user_id, product_id)                     |
| `orders` + `order_items` | owner read                  | order_items joinable via orders                 |

### Key Fetch Patterns

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

// Special Offers — produk dengan discount_percent terisi
const { data: specialOffers } = await supabase
  .from('products')
  .select('id, slug, price, discount_percent, category_id, product_translations!inner(title, short_description)')
  .eq('status', true)
  .eq('is_draft', false)
  .not('discount_percent', 'is', null)
  .eq('product_translations.language_id', activeLangId)
  .limit(10)

// Featured Products — flag manual is_featured
const { data: featuredProducts } = await supabase
  .from('products')
  .select('id, slug, price, discount_percent, category_id, product_translations!inner(title, short_description)')
  .eq('status', true)
  .eq('is_draft', false)
  .eq('is_featured', true)
  .eq('product_translations.language_id', activeLangId)
  .limit(10)

// New Arrivals — urut created_at terbaru
const { data: newArrivals } = await supabase
  .from('products')
  .select('id, slug, price, discount_percent, category_id, created_at, product_translations!inner(title, short_description)')
  .eq('status', true)
  .eq('is_draft', false)
  .eq('product_translations.language_id', activeLangId)
  .order('created_at', { ascending: false })
  .limit(10)

// Produk per kategori (Clothing, Jewelry & Accessories, dst) — filter via category_id
const { data: categoryProducts } = await supabase
  .from('products')
  .select('id, slug, price, discount_percent, category_id, product_translations!inner(title, short_description)')
  .eq('status', true)
  .eq('is_draft', false)
  .eq('category_id', categoryId) // ambil dari categories.slug = 'clothing' / 'jewelry-accessories'
  .eq('product_translations.language_id', activeLangId)
  .limit(10)

// Image produk: schema belum punya kolom gambar — pakai placeholder deterministik
// const imageUrl = `https://picsum.photos/seed/product-${product.id}/400/400`

// Upsert profile setelah Google OAuth callback
await supabase.from('profiles').upsert({
  id: user.id,
  full_name: user.user_metadata.full_name ?? '',
  avatar_url: user.user_metadata.avatar_url ?? null,
}, { onConflict: 'id' })
```

### TypeScript Types

```ts
import type { Database } from '@/types/supabase'
type Profile  = Database['public']['Tables']['profiles']['Row']
type Currency = Database['public']['Tables']['currencies']['Row']
type Language = Database['public']['Tables']['languages']['Row']
type Category = Database['public']['Tables']['categories']['Row']
type Product  = Database['public']['Tables']['products']['Row']
```

Generate ulang types setiap ada perubahan schema:
```bash
npx supabase gen types typescript --project-id <id> > src/types/supabase.ts
```

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
- env var `NEXT_PUBLIC_EXCHANGE_RATE_API_KEY` tidak diperlukan — rate sudah ada di DB

---

## 10. FEATURE BUILD ORDER

Ikuti urutan ini untuk membangun fitur:

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
  [x] Location picker (country-state-city)

Phase 4 — Polish
  [x] Loading states, skeletons
  [x] Error handling & toasts
  [x] Mobile responsive
  [x] SEO (next/metadata)

Phase 5 — Product Sections (Homepage)
  [ ] PRASYARAT (manual, sudah/akan dijalankan user sendiri di Supabase SQL editor — BUKAN tugas agent):
      migration kolom discount_percent + is_featured, seed dummy products + translations
  [ ] ProductCard component (reusable, DESIGN.md §4.6)
  [ ] ProductGridSection component (template, DESIGN.md §4.7)
  [ ] Special Offers section
  [ ] Featured Products section
  [ ] New Arrivals section
  [ ] Shop By Category — Clothing section
  [ ] Shop By Category — Jewelry & Accessories section
  [ ] Verifikasi: ganti currency di topbar → harga di semua section ikut berubah
```

---

## 11. COMMON PITFALLS — HINDARI

| Masalah                          | Solusi                                     |
|----------------------------------|--------------------------------------------|
| Hydration mismatch               | Pastikan state dari zustand ada `_hasHydrated` guard |
| Google Auth redirect loop        | Cek `/auth/callback` handler sudah benar   |
| Turnstile token expired          | Reset widget setelah submit gagal          |
| RTL layout breakage              | Test setiap layout change dengan AR locale |
| Currency rate stale              | Cache dengan timestamp, refresh tiap 1 jam |
| `useSearchParams` SSR error      | Wrap dengan `<Suspense>`                   |
| shadcn dialog + framer conflict  | Gunakan satu saja, jangan mix              |

---

## 12. QUICK REFERENCE — DESIGN TOKENS

```
Primary color:   #0BAF9A
Topbar bg:       #1B2333
Border:          #E5E7EB
Text main:       #1F2937
Text muted:      #6B7280
Placeholder:     #9CA3AF
Input height:    52px
Nav height:      64px
Topbar height:   40px
Category nav h:  48px
Border radius:   6px (inputs/buttons), 8px (cards), 12px (modal)
Font:            Inter
```

---

*Antigravity harus merujuk file ini + DESIGN.md di setiap sesi sebelum memulai tugas baru.*