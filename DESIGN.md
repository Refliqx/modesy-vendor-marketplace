# DESIGN.md — Modesy Marketplace Clone
> Visual specification untuk 99% pixel-perfect reproduction dari modesy.codingest.com
> Stack: Next.js 14 (App Router) · TailwindCSS v3 · Supabase

---

## 1. COLOR TOKENS

```css
/* globals.css atau tailwind.config.ts */
--color-primary:     #0BAF9A;   /* Teal accent — Sell Now, Register btn, logo "o" */
--color-primary-hover: #099D8A; /* Hover state primary */
--color-topbar-bg:   #1B2333;   /* Utility bar top (dark navy) */
--color-topbar-text: #FFFFFF;   /* Text di topbar */
--color-nav-bg:      #FFFFFF;   /* Main navbar background */
--color-body-bg:     #FFFFFF;   /* Page body */
--color-border:      #E5E7EB;   /* Input & card borders */
--color-placeholder: #9CA3AF;   /* Input placeholder text */
--color-text-main:   #1F2937;   /* Primary body text */
--color-text-muted:  #6B7280;   /* Secondary / muted text */
--color-text-light:  #D1D5DB;   /* Separator text ("Or register with email") */
--color-modal-overlay: rgba(0,0,0,0.5); /* Login modal backdrop */
--color-success:     #22C55E;   /* Cloudflare Turnstile success checkmark */
```

**Tailwind config extension:**
```ts
// tailwind.config.ts
extend: {
  colors: {
    primary: {
      DEFAULT: '#0BAF9A',
      hover:   '#099D8A',
    },
    topbar: '#1B2333',
  },
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  },
}
```

---

## 2. TYPOGRAPHY

| Role           | Font     | Weight | Size (desktop) | Line Height |
|----------------|----------|--------|----------------|-------------|
| Logo "Modesy"  | Inter    | 700    | 28px           | 1           |
| Nav links      | Inter    | 400    | 14px           | 1.25        |
| Category links | Inter    | 400    | 14px           | 1.25        |
| Hero title     | Inter    | 700    | 42px           | 1.2         |
| Hero subtitle  | Inter    | 400    | 16px           | 1.5         |
| Section title  | Inter    | 700    | 22px           | 1.3         |
| Input text     | Inter    | 400    | 14px           | 1.5         |
| Button text    | Inter    | 600    | 14–15px        | 1           |
| Modal title    | Inter    | 700    | 24px           | 1.2         |
| Utility bar    | Inter    | 400    | 13px           | 1           |

---

## 3. LAYOUT STRUCTURE

### 3.1 Topbar (Utility Bar)
```
┌────────────────────────────────────────────────────────────────┐
│ bg: #1B2333 · h-10 (40px) · w-full                            │
│                                                                  │
│ [Contact]  [Sell on Modesy]   ···   [📍 Location] [USD ($) ▾] [🇺🇸 English ▾] [Login / Register] │
│ left: flex gap-6 px-6          right: flex gap-4 items/center   │
└────────────────────────────────────────────────────────────────┘
```
- Font: 13px, text-white
- Divider antara Login dan Register: `/` dengan opacity-40
- Hover: underline, opacity-80
- Klik "Location" → dropdown/modal Country+State picker
- Klik "USD ($)" → dropdown currency list
- Klik "English" → dropdown language toggle
- Klik "Login" / "Register" → buka modal / navigasi ke /register

### 3.2 Main Navbar
```
┌────────────────────────────────────────────────────────────────┐
│ bg: white · h-16 (64px) · border-b border-gray-100 · shadow-sm│
│                                                                  │
│  [Modesy logo]   [🔍 Search for products, categories or brands] │
│                                                          [🛒 Cart] [♡ Wishlist] [Sell Now btn] │
└────────────────────────────────────────────────────────────────┘
```

**Logo:**
- Text: "Modesy"
- "M": color #1F2937 (dark), font-bold, text-2xl
- "o": color #0BAF9A (primary teal), same weight
- Semua huruf lainnya: #1F2937

**Search Bar:**
- Width: ~55% of nav width (max-w-xl)
- Height: 44px
- Border: 1px solid #E5E7EB, border-radius: 6px
- Placeholder: "Search for products, categories or brands"
- Search icon (🔍) di kanan dalam input, color #9CA3AF
- Focus: border-color #0BAF9A, ring-1 ring-primary

**Cart & Wishlist:**
- Icon size: 24px
- Label font: 14px, font-medium
- Color: #1F2937
- Cart: shopping-cart icon dari lucide-react
- Wishlist: heart icon dari lucide-react

**Sell Now Button:**
- bg: #0BAF9A, text-white
- padding: px-5 py-2.5
- border-radius: 6px
- font-weight: 600, font-size: 14px
- hover: bg #099D8A
- transition: 150ms ease

### 3.3 Category Navigation Bar
```
┌────────────────────────────────────────────────────────────────┐
│ bg: white · h-12 (48px) · border-b border-gray-100            │
│                                                                  │
│ Clothing · Shoes · Home & Living · Jewelry & Accessories · Toys & Entertainment · Graphics & Photos · Video & Audio · Web Templates & Code │
└────────────────────────────────────────────────────────────────┘
```
- Container: max-w-screen-xl mx-auto px-6
- Items: flex gap-8 items-center h-full
- Font: 14px, font-normal, color #1F2937
- Hover: color #0BAF9A, underline
- Active/current: color #0BAF9A, font-medium

### 3.4 Hero Carousel
```
┌────────────────────────────────────────────────────────────────┐
│ w-full · h-[480px] desktop / h-[320px] mobile                  │
│ relative · overflow-hidden                                       │
│                                                                  │
│  [← prev arrow]                              [next arrow →]    │
│                                                                  │
│  bg-image (full bleed, object-cover, object-center)            │
│                                                                  │
│  TEXT OVERLAY (left side, z-10):                               │
│   Title: bold, 42px, text-white                                │
│   Subtitle: 16px, text-white/80                                │
│   [Buy Now btn]: bg-gray-900, text-white, px-6 py-3, rounded  │
│                                                                  │
│  Dots pagination: bottom-center                                 │
└────────────────────────────────────────────────────────────────┘
```

**Carousel arrows:**
- Circle button, bg white/20 backdrop-blur-sm, w-10 h-10
- ChevronLeft / ChevronRight dari lucide-react, size 20px
- Position: absolute, top-1/2 -translate-y-1/2, left-4 / right-4

**Dots:**
- Position: absolute bottom-4, centered
- Active dot: bg-white w-6 h-2 rounded-full
- Inactive dot: bg-white/50 w-2 h-2 rounded-full
- Transition: width 300ms

### 3.5 Shop By Category Section
```
┌────────────────────────────────────────────────────────────────┐
│ py-12 px-6 · max-w-screen-xl mx-auto                          │
│                                                                  │
│ [Shop By Category] (h2, bold 22px)     [View All →] (teal, 14px, right) │
│                                                                  │
│ Grid 6 col desktop / 3 col tablet / 2 col mobile:             │
│                                                                  │
│  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐ │
│  │  img  │  │  img  │  │  img  │  │  img  │  │  img  │  │  img  │ │
│  │ (circle)│                                                    │
│  └───────┘                                                      │
│  Category Name (center, 14px, mt-3)                            │
└────────────────────────────────────────────────────────────────┘
```

**Category circles:**
- Size: w-44 h-44 (176px) desktop
- Shape: rounded-full, overflow-hidden
- Image: object-cover, w-full h-full
- Hover: scale-105, transition 200ms, cursor-pointer
- Hover overlay: bg-primary/20 appears on hover, with "Shop Now →" text center
- Shadow: shadow-md on hover

---

## 4. COMPONENT SPECS

### 4.1 Register Page (`/register`)

**Layout:**
- breadcrumb: "Home / Register" at top (text-sm, text-gray-500)
- Content centered: max-w-lg mx-auto, py-16

**Card container:**
- No card border — content sits on white bg directly
- Title: "Register", text-3xl font-bold, text-center, mb-8

**Connect with Google button:**
- Full width, height 52px
- Border: 1px solid #E5E7EB, rounded-md
- Bg: white, hover: bg-gray-50
- Google "G" logo: official SVG (multicolor), size 20px, mr-3
- Text: "Connect with Google", font-medium, text-gray-700

**Divider:**
- "Or register with email"
- text-sm text-gray-400, text-center, my-4
- No horizontal lines (just the text)

**Input fields:**
- Height: 52px
- Border: 1px solid #E5E7EB, rounded-md
- Padding: px-4
- Font: 14px, color #1F2937
- Placeholder: color #9CA3AF
- Focus: border-primary ring-1 ring-primary/30
- Full width, mb-3 between each

**Fields order:**
1. First Name
2. Last Name
3. Email Address
4. Password
5. Confirm Password

**Terms checkbox:**
- Custom checkbox, border-gray-300, checked: bg-primary border-primary
- Label: "I have read and agree to the" + "Terms & Conditions" (underline, font-medium)
- mt-4 mb-4

**Cloudflare Turnstile:**
- Wrapper: border border-gray-200 rounded-lg p-3 bg-white shadow-sm
- Width: 100% (contained in form)
- Shows: green checkmark ✅ + "Success!" text on left, Cloudflare logo on right
- Height: ~65px
- mt-4 mb-6

**Register button:**
- Full width, height: 52px
- bg-primary, text-white, font-semibold
- rounded-md, hover: bg-primary-hover
- Text: "Register"

### 4.2 Login Modal (tidak route terpisah — modal overlay)

**Trigger:** Klik "Login" di topbar

**Backdrop:**
- Fixed overlay: bg-black/50, z-50
- Click outside → close modal

**Modal card:**
- Width: 380px (max-w-sm)
- bg-white, rounded-xl, shadow-2xl
- padding: p-8
- Position: centered (fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2)
- z-index: z-50

**Close button:**
- Absolute top-4 right-4
- X icon (lucide), size 20px, text-gray-400, hover: text-gray-700

**Content:**
- Title: "Login", text-2xl font-bold, text-center, mb-6
- "Connect with Google" button — same spec as register
- Divider: "Or login with email"
- Email Address input
- Password input
- "Forgot Password?" — right-aligned, text-sm, text-primary
- "Login" button — full width, bg-primary
- "Don't have an account? Register" — center, text-sm, Register adalah text-primary underline

### 4.3 Language Switcher Dropdown

**Trigger:** "🇺🇸 English ▾" di topbar

**Dropdown card:**
- bg-white, border border-gray-200, rounded-md, shadow-lg
- Position: absolute, top-full, right-0, mt-1, w-44
- z-index: z-50

**Options:**
```
🇺🇸  English         ✓ (if active)
🇸🇦  العربية
```
- Each option: px-4 py-3, flex items-center gap-3
- Flag: emoji atau SVG flag icon (react-country-flag)
- Hover: bg-gray-50
- Active: text-primary, font-medium
- RTL support: ketika Arabic aktif, direction: rtl pada html element

**Implementation:**
- `next-i18next` atau `next-intl`
- Locale routes: `/en/...` dan `/ar/...`
- RTL: tambah `dir="rtl"` pada `<html>` untuk Arabic

### 4.4 Currency Switcher Dropdown

**Trigger:** "USD ($) ▾" di topbar

**Dropdown card:**
- bg-white, border border-gray-200, rounded-md, shadow-lg
- w-52, max-h-72, overflow-y-auto
- scrollbar-thin (tailwind-scrollbar plugin)

**Currency list:**
```
$ USD – US Dollar          ✓
€ EUR – Euro
R$ BRL – Brazilian Real
£ GBP – British Pound
Rp IDR – Indonesian Rupiah
₹ INR – Indian Rupee
₦ NGN – Nigerian Naira
₽ RUB – Russian Ruble
₺ TRY – Turkish Lira
```
- Each row: px-4 py-2.5, flex justify-between items-center
- Symbol bold text-gray-800, code text-gray-500 text-sm, name text-gray-600
- Active: bg-primary/10, text-primary font-medium
- Hover: bg-gray-50

**Implementation:**
- Store di Zustand: `useCurrencyStore`
- Konversi rate: fetch dari `api.exchangerate-api.com` atau static fallback
- Format angka dengan `Intl.NumberFormat`

### 4.5 Location Picker

**Trigger:** "📍 Location" di topbar

**Modal / Dropdown:**
- Modal style (seperti login modal), lebar 480px
- Title: "Select Your Location"

**Step 1 — Country:**
- Searchable combobox (react-select atau cmdk)
- List negara dengan flag emoji + nama
- Placeholder: "Search country..."

**Step 2 — State/Province:**
- Muncul setelah country dipilih
- Dropdown state berdasarkan country yang dipilih
- Library: `country-state-city` (npm package)

**Confirm button:**
- "Set Location", full width, bg-primary

**Display di topbar setelah dipilih:**
```
📍 Jakarta, ID
```

### 4.6 Product Card (reusable — dipakai di semua product grid section)

```
┌───────────────────┐
│  [discount badge] │  ← top-left, hanya jika discount_percent not null
│                    │
│      image         │  aspect-square, object-cover
│                    │
│         [♡]        │  ← top-right, wishlist toggle, muncul on hover (desktop) / selalu (mobile)
├───────────────────┤
│ Category name       │  text-xs text-gray-400, uppercase, tracking-wide
│ Product title        │  text-sm font-medium text-text-main, line-clamp-2
│ ★★★★☆ (24)          │  text-xs text-gray-500, hanya jika ada rating
│ $24.00  $32.00       │  price (primary, bold) + strikethrough harga asli jika diskon
└───────────────────┘
```

**Spesifikasi:**
- Container: bg-white, rounded-lg (8px), border border-gray-100, overflow-hidden
- Hover: shadow-md, transition-shadow 200ms
- Image wrapper: aspect-square, bg-gray-50, relative
- Discount badge: absolute top-2 left-2, bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md, format `-{discount_percent}%`
- Wishlist icon: absolute top-2 right-2, w-8 h-8 rounded-full bg-white/90 flex items-center justify-center, Heart icon lucide 16px, hover: text-red-500
- Content padding: p-3
- Category label: mb-1
- Title: mb-1.5, min-h dua baris (line-clamp-2) biar grid rata
- Rating: mb-1.5, Star icon lucide fill-yellow-400, hanya render jika `rating_average` tersedia (saat ini dummy, kolom belum ada di schema — lihat §12.8)
- Price row: flex items-center gap-2
  - Harga jual (setelah diskon jika ada): text-primary font-bold text-base
  - Harga asli (jika diskon): text-gray-400 text-sm line-through
  - Harga normal (tanpa diskon): text-text-main font-bold text-base, tanpa strikethrough
- Harga diformat pakai `useCurrencyStore` (ikut perubahan currency switcher) + `Intl.NumberFormat`

### 4.7 Product Grid Section (template untuk Special Offers / Featured / New Arrivals / Category sections)

```
┌────────────────────────────────────────────────────────────────┐
│ py-12 px-6 · max-w-screen-xl mx-auto                          │
│                                                                  │
│ [Section Title] (h2, bold 22px)        [View All →] (teal, 14px)│
│ [Optional subtitle text-sm text-gray-500]                       │
│                                                                  │
│ Grid 5 col desktop / 3 col tablet / 2 col mobile, gap-4/gap-6  │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                       │
│  │ card │ │ card │ │ card │ │ card │ │ card │                       │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                       │
└────────────────────────────────────────────────────────────────┘
```

- Header sama persis dengan "Shop By Category" (lihat §3.5): h2 bold 22px kiri, "View All →" text-primary 14px kanan
- Grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`, gap-4 mobile / gap-6 desktop
- Limit fetch per section: 10 produk (5 kolom × 2 baris desktop)
- Section ini reuse `<ProductCard />` yang sama, hanya data source query yang beda:
  - **Special Offers**: `.not('discount_percent', 'is', null)`
  - **Featured Products**: `.eq('is_featured', true)`
  - **New Arrivals**: `.order('created_at', { ascending: false })`
  - **Clothing** / **Jewelry & Accessories**: filter `category_id` via slug kategori terkait
- "View All →" link mengarah ke halaman kategori/listing (route belum dibangun — gunakan `href="#"` sementara, tandai TODO di komponen, bukan di kode)

### 4.8 Product Image Placeholder (sementara — schema belum punya kolom image)

> Schema `products` saat ini belum memiliki kolom gambar (lihat §12.8). Untuk sementara, gunakan
> placeholder image deterministik berdasarkan `product.id` agar konsisten antar reload:
> `https://picsum.photos/seed/product-{id}/400/400`
> Ganti ke kolom asli begitu schema image (kolom atau tabel `product_images`) ditambahkan.

---

## 5. PAGE SECTIONS ORDER (Homepage)

```
1. Topbar (utility bar)
2. Main Navbar
3. Category Nav
4. Hero Carousel (full-width, ~480px tall)
5. Shop By Category (grid circles)
6. Special Offers (product grid, discount_percent not null)
7. Featured Products (product grid, is_featured = true)
8. New Arrivals (product grid, order by created_at desc)
9. Shop By Category — Clothing (product grid, category slug 'clothing')
10. Shop By Category — Jewelry & Accessories (product grid, category slug 'jewelry-accessories')
11. [future] Banner Promo
12. Footer
```

---

## 6. BREADCRUMB

- Font: text-sm, color #6B7280
- Active page: text-gray-900 font-medium
- Separator: "/" dengan mx-1
- Container: max-w-screen-xl mx-auto px-6, py-4

---

## 7. RESPONSIVE BREAKPOINTS

| Breakpoint | Width    | Behavior                                    |
|------------|----------|---------------------------------------------|
| mobile     | < 640px  | Stack nav, hide some utility bar items      |
| tablet     | 640-1024 | 3-col category grid                         |
| desktop    | > 1024px | Full layout, 6-col category grid            |

---

## 8. SPACING SYSTEM

Gunakan Tailwind default scale:
- Section padding: `py-12` (48px vertical)
- Container: `max-w-screen-xl mx-auto px-6`
- Input margin bottom: `mb-3`
- Card padding: `p-8`
- Button padding: `px-6 py-3` (standard), `px-5 py-2.5` (compact)

---

## 9. ANIMATION & TRANSITIONS

- Dropdown open/close: `transition-all duration-200 ease-out` + scale-y dari 0.95→1
- Modal open: `transition opacity + scale (0.95→1) duration-200`
- Carousel slide: `translateX` dengan `transition-transform duration-500 ease-in-out`
- Category hover scale: `transition-transform duration-200 hover:scale-105`
- Button hover: `transition-colors duration-150`

Gunakan `framer-motion` untuk modal masuk/keluar (AnimatePresence).

---

## 10. ICONS

Gunakan `lucide-react` untuk semua ikon:
- Cart: `ShoppingCart`
- Wishlist: `Heart`
- Search: `Search`
- Location: `MapPin`
- Chevron/Arrow: `ChevronLeft`, `ChevronRight`, `ChevronDown`
- Close: `X`
- Check: `Check`
- Arrow right: `ArrowRight`

---

## 11. LIBRARY STACK (Next.js ecosystem)

| Kebutuhan               | Library                          |
|-------------------------|----------------------------------|
| UI components base      | shadcn/ui (Radix UI primitives)  |
| Icons                   | lucide-react                     |
| Animasi                 | framer-motion                    |
| State management        | zustand                          |
| Auth                    | @supabase/ssr + supabase-js      |
| Form handling           | react-hook-form + zod            |
| Internasionalisasi      | next-intl                        |
| Country/State data      | country-state-city               |
| Country flag            | react-country-flag               |
| Currency conversion     | exchangerate-api (REST) + zustand cache |
| Carousel                | embla-carousel-react             |
| Cloudflare Turnstile    | @marsidev/react-turnstile        |
| Dropdown combobox       | cmdk                             |
| Tailwind scrollbar      | tailwind-scrollbar               |
| Date utils              | date-fns                         |
| Image optimization      | next/image (built-in)            |
| HTTP client             | ky atau fetch native             |

---

## 12. SUPABASE SCHEMA

> Schema aktual dari database. Jangan buat ulang tabel ini — sudah ada di Supabase.
> Gunakan sebagai referensi saat query, join, dan menulis TypeScript types.

### 12.1 Custom Enums

```sql
-- Pastikan enum ini sudah ada sebelum seed
create type user_role   as enum ('buyer', 'vendor', 'admin');
create type product_type as enum ('physical', 'digital');
```

### 12.2 Core Tables

```
┌─────────────────┐       ┌──────────────────┐
│   auth.users    │──1:1──│    profiles      │
│  (Supabase)     │       │  id (uuid PK)    │
└─────────────────┘       │  full_name       │
                          │  role            │  ← user_role enum
                          │  avatar_url      │
                          │  phone_number    │
                          │  created_at      │
                          │  updated_at      │
                          └────────┬─────────┘
                                   │ 1:1 (via user_id)
                          ┌────────▼─────────┐
                          │     vendors      │
                          │  id (int4 PK)    │
                          │  user_id (uuid)  │
                          │  shop_name       │
                          │  shop_slug       │
                          │  shop_logo       │
                          │  shop_description│
                          │  balance         │
                          │  custom_commission_rate │
                          │  is_verified     │
                          │  status          │
                          └────────┬─────────┘
                                   │ 1:N
                          ┌────────▼─────────┐
                          │    products      │
                          │  id · vendor_id  │
                          │  category_id     │
                          │  type            │  ← product_type enum
                          │  slug · price    │
                          │  stock · weight  │
                          │  is_draft · status│
                          └──────────────────┘
```

### 12.3 Full Table Definitions

```sql
-- ─────────────────────────────────────────
-- LANGUAGES
-- ─────────────────────────────────────────
create table public.languages (
  id             int4        primary key generated always as identity,
  name           varchar     not null,
  code           varchar     not null unique,     -- 'en', 'ar'
  text_direction varchar,                          -- 'ltr', 'rtl'
  is_default     bool        default false,
  status         bool        default true,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ─────────────────────────────────────────
-- CURRENCIES
-- ─────────────────────────────────────────
create table public.currencies (
  id            int4        primary key generated always as identity,
  name          varchar     not null,
  code          varchar     not null unique,   -- 'USD', 'IDR', ...
  symbol        varchar     not null,          -- '$', 'Rp', ...
  exchange_rate numeric     not null,          -- relative to base (USD=1)
  is_default    bool        default false,
  status        bool        default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─────────────────────────────────────────
-- PROFILES  (extends auth.users 1:1)
-- ─────────────────────────────────────────
create table public.profiles (
  id           uuid        primary key references auth.users(id) on delete cascade,
  full_name    varchar     not null default '',
  role         user_role   default 'buyer',
  avatar_url   text,
  phone_number varchar,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ─────────────────────────────────────────
-- VENDORS
-- ─────────────────────────────────────────
create table public.vendors (
  id                    int4    primary key generated always as identity,
  user_id               uuid    unique references auth.users(id) on delete set null,
  shop_name             varchar not null unique,
  shop_slug             varchar not null unique,
  shop_logo             text,
  shop_description      text,
  balance               numeric default 0,
  custom_commission_rate numeric,
  is_verified           bool    default false,
  status                bool    default true,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ─────────────────────────────────────────
-- CATEGORIES  (translatable)
-- ─────────────────────────────────────────
create table public.categories (
  id         int4    primary key generated always as identity,
  slug       varchar not null unique,
  image_path varchar,
  status     bool    default true,
  created_at timestamptz default now()
);

create table public.category_translations (
  id          int4    primary key generated always as identity,
  category_id int4    references public.categories(id) on delete cascade,
  language_id int4    references public.languages(id) on delete cascade,
  name        varchar not null
);

-- ─────────────────────────────────────────
-- PRODUCTS  (translatable)
-- ─────────────────────────────────────────
create table public.products (
  id                int4         primary key generated always as identity,
  vendor_id         int4         references public.vendors(id) on delete set null,
  category_id       int4         references public.categories(id) on delete set null,
  type              product_type not null,
  slug              varchar      not null unique,
  price             numeric      not null,
  discount_percent  numeric,                         -- nullable, 1-99. NOT NULL = produk masuk Special Offers
  is_featured       bool         default false,      -- manual flag untuk section Featured Products
  stock             int4         not null default 0,
  weight            int4,                              -- gram, nullable for digital
  is_draft          bool         default true,
  status            bool         default true,
  created_at        timestamptz  default now(),
  updated_at        timestamptz  default now()
);

create table public.product_translations (
  id                int4    primary key generated always as identity,
  product_id        int4    references public.products(id) on delete cascade,
  language_id       int4    references public.languages(id) on delete cascade,
  title             varchar not null,
  description       text    not null,
  short_description varchar
);

-- ─────────────────────────────────────────
-- CART
-- ─────────────────────────────────────────
create table public.cart_items (
  id         int4        primary key generated always as identity,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  product_id int4        not null references public.products(id) on delete cascade,
  quantity   int4        not null default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, product_id)
);

-- ─────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────
create table public.orders (
  id                 int4    primary key generated always as identity,
  user_id            uuid    references auth.users(id) on delete set null,
  order_number       varchar not null unique,
  total_price        numeric not null,
  total_shipping_cost numeric not null default 0,
  payment_status     varchar,           -- 'pending', 'paid', 'failed', 'refunded'
  payment_method     varchar,
  shipping_address   text    not null,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

create table public.order_items (
  id                int4    primary key generated always as identity,
  order_id          int4    not null references public.orders(id) on delete cascade,
  vendor_id         int4    not null references public.vendors(id),
  product_id        int4    not null references public.products(id),
  price             numeric not null,
  quantity          int4    not null,
  shipping_cost     numeric default 0,
  commission_amount numeric,
  vendor_earning    numeric,
  order_status      varchar,           -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  tracking_number   varchar,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);
```

### 12.4 RLS Policies

```sql
-- PROFILES
alter table public.profiles enable row level security;
create policy "profiles: read own"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles for update using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles for insert with check (auth.uid() = id);

-- CART ITEMS
alter table public.cart_items enable row level security;
create policy "cart: all own" on public.cart_items
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ORDERS
alter table public.orders enable row level security;
create policy "orders: read own" on public.orders for select using (auth.uid() = user_id);

-- ORDER ITEMS (readable via order ownership)
alter table public.order_items enable row level security;
create policy "order_items: read via order" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- LANGUAGES & CURRENCIES: public read
alter table public.languages  enable row level security;
alter table public.currencies enable row level security;
create policy "languages: public read"  on public.languages  for select using (true);
create policy "currencies: public read" on public.currencies for select using (true);

-- CATEGORIES & TRANSLATIONS: public read
alter table public.categories             enable row level security;
alter table public.category_translations  enable row level security;
create policy "categories: public read"            on public.categories            for select using (status = true);
create policy "category_translations: public read" on public.category_translations for select using (true);

-- PRODUCTS & TRANSLATIONS: public read (non-draft only)
alter table public.products             enable row level security;
alter table public.product_translations enable row level security;
create policy "products: public read"            on public.products            for select using (status = true and is_draft = false);
create policy "product_translations: public read" on public.product_translations for select using (true);

-- VENDORS: public read (active only)
alter table public.vendors enable row level security;
create policy "vendors: public read"  on public.vendors for select using (status = true);
create policy "vendors: update own"   on public.vendors for update using (auth.uid() = user_id);
```

### 12.5 Auto-create Profile on Signup (Trigger)

```sql
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 12.6 TypeScript Types (auto-generate dengan `supabase gen types`)

```bash
npx supabase gen types typescript --project-id <id> > src/types/supabase.ts
```

Key types yang sering dipakai:
```ts
import type { Database } from '@/types/supabase'

type Profile     = Database['public']['Tables']['profiles']['Row']
type Currency    = Database['public']['Tables']['currencies']['Row']
type Language    = Database['public']['Tables']['languages']['Row']
type Category    = Database['public']['Tables']['categories']['Row']
type Product     = Database['public']['Tables']['products']['Row']
type CartItem    = Database['public']['Tables']['cart_items']['Row']
type Order       = Database['public']['Tables']['orders']['Row']
type OrderItem   = Database['public']['Tables']['order_items']['Row']
type Vendor      = Database['public']['Tables']['vendors']['Row']
```

### 12.7 Seed Data (Languages & Currencies)

```sql
-- Languages
insert into public.languages (name, code, text_direction, is_default, status) values
  ('English', 'en', 'ltr', true,  true),
  ('Arabic',  'ar', 'rtl', false, true);

-- Currencies
insert into public.currencies (name, code, symbol, exchange_rate, is_default, status) values
  ('US Dollar',        'USD', '$',  1.0,     true,  true),
  ('Euro',             'EUR', '€',  0.92,    false, true),
  ('Brazilian Real',   'BRL', 'R$', 5.05,    false, true),
  ('British Pound',    'GBP', '£',  0.79,    false, true),
  ('Indonesian Rupiah','IDR', 'Rp', 16250.0, false, true),
  ('Indian Rupee',     'INR', '₹',  83.5,    false, true),
  ('Nigerian Naira',   'NGN', '₦',  1580.0,  false, true),
  ('Russian Ruble',    'RUB', '₽',  89.5,    false, true),
  ('Turkish Lira',     'TRY', '₺',  32.1,    false, true);
```

### 12.8 Migration — Kolom Baru di `products`

> **Dijalankan manual oleh developer di Supabase SQL editor — bukan tugas agent/Kiro.**
> Tabel `products` di Supabase sudah ada lebih dulu tanpa kolom ini. Jalankan migration berikut
> sebelum agent mulai membangun fetch/komponen Phase 5:

```sql
alter table public.products
  add column if not exists discount_percent numeric,
  add column if not exists is_featured bool default false;
```

**Catatan kolom gambar:** schema saat ini belum punya kolom/tabel untuk gambar produk. Sambil
menunggu keputusan final (kolom `image_path` vs tabel `product_images` 1:N), frontend memakai
placeholder deterministik `https://picsum.photos/seed/product-{id}/400/400` (lihat DESIGN.md §4.8).
Tidak ada kolom gambar di seed dummy di bawah ini.

**Catatan kolom rating:** schema belum punya kolom/tabel rating & review. Komponen `ProductCard`
dibuat toleran terhadap field ini kosong (rating tidak dirender jika data tidak tersedia).

### 12.9 Dummy Seed Data — Products untuk Special Offers / Featured / New Arrivals / Clothing / Jewelry

> **Dijalankan manual oleh developer di Supabase SQL editor — bukan tugas agent/Kiro.**
> Asumsi: minimal 1 vendor sudah ada di tabel `vendors` (ambil id pertama). Kategori `clothing` dan
> `jewelry-accessories` harus sudah ada slug-nya di tabel `categories` (lihat §3.3 untuk daftar kategori).
> Bahasa default `en` dipakai untuk `product_translations`.

```sql
-- Ambil reference id yang dibutuhkan (sesuaikan dengan data aktual di project)
-- vendor_id   : select id from public.vendors limit 1;
-- category_id : select id from public.categories where slug = 'clothing';
--             : select id from public.categories where slug = 'jewelry-accessories';
-- language_id : select id from public.languages where code = 'en';

-- ─────────────────────────────────────────
-- SPECIAL OFFERS (discount_percent not null) — 6 produk
-- ─────────────────────────────────────────
insert into public.products (vendor_id, category_id, type, slug, price, discount_percent, is_featured, stock, weight, is_draft, status) values
  (1, 1, 'physical', 'denim-jacket-classic',     59.00, 20, false, 40, 800, false, true),
  (1, 2, 'physical', 'leather-sneakers-white',   89.00, 15, false, 25, 950, false, true),
  (1, 4, 'physical', 'gold-plated-necklace',     34.00, 30, false, 60, 50,  false, true),
  (1, 1, 'physical', 'oversized-knit-sweater',   45.00, 25, false, 35, 600, false, true),
  (1, 3, 'physical', 'ceramic-vase-set',         28.00, 10, false, 50, 1200,false, true),
  (1, 4, 'physical', 'silver-hoop-earrings',     19.00, 35, false, 80, 30,  false, true);

-- ─────────────────────────────────────────
-- FEATURED PRODUCTS (is_featured = true) — 6 produk
-- ─────────────────────────────────────────
insert into public.products (vendor_id, category_id, type, slug, price, discount_percent, is_featured, stock, weight, is_draft, status) values
  (1, 1, 'physical', 'tailored-blazer-black',    120.00, null, true, 20, 700, false, true),
  (1, 2, 'physical', 'running-shoes-pro',        99.00,  null, true, 30, 900, false, true),
  (1, 5, 'physical', 'wireless-earbuds-v2',      75.00,  null, true, 45, 150, false, true),
  (1, 6, 'digital',  'photoshop-action-pack',    15.00,  null, true, 999,null,false, true),
  (1, 3, 'physical', 'minimalist-desk-lamp',     42.00,  null, true, 28, 1100,false, true),
  (1, 4, 'physical', 'pearl-drop-earrings',      26.00,  null, true, 55, 25,  false, true);

-- ─────────────────────────────────────────
-- NEW ARRIVALS (terbaru by created_at) — 6 produk
-- ─────────────────────────────────────────
insert into public.products (vendor_id, category_id, type, slug, price, discount_percent, is_featured, stock, weight, is_draft, status) values
  (1, 1, 'physical', 'linen-shirt-summer',       38.00, null, false, 40, 400, false, true),
  (1, 2, 'physical', 'canvas-slip-on',           54.00, null, false, 33, 700, false, true),
  (1, 4, 'physical', 'minimal-chain-bracelet',   22.00, null, false, 70, 20,  false, true),
  (1, 7, 'physical', 'plush-teddy-bear',         18.00, null, false, 60, 350, false, true),
  (1, 8, 'digital',  'lightroom-presets-vol3',   12.00, null, false, 999,null,false, true),
  (1, 1, 'physical', 'wide-leg-trousers',        49.00, null, false, 38, 500, false, true);

-- ─────────────────────────────────────────
-- CLOTHING — produk tambahan khusus kategori (untuk section "Shop By Category — Clothing")
-- ─────────────────────────────────────────
insert into public.products (vendor_id, category_id, type, slug, price, discount_percent, is_featured, stock, weight, is_draft, status) values
  (1, 1, 'physical', 'cropped-denim-jacket',     52.00, null, false, 30, 750, false, true),
  (1, 1, 'physical', 'striped-cotton-tee',       19.00, null, false, 90, 200, false, true),
  (1, 1, 'physical', 'pleated-midi-skirt',       36.00, null, false, 45, 350, false, true),
  (1, 1, 'physical', 'classic-trench-coat',      135.00,null, false, 15, 1300,false, true),
  (1, 1, 'physical', 'ribbed-tank-top',          14.00, null, false, 100,150, false, true);

-- ─────────────────────────────────────────
-- JEWELRY & ACCESSORIES — produk tambahan khusus kategori
-- ─────────────────────────────────────────
insert into public.products (vendor_id, category_id, type, slug, price, discount_percent, is_featured, stock, weight, is_draft, status) values
  (1, 4, 'physical', 'rose-gold-ring',           29.00, null, false, 65, 15, false, true),
  (1, 4, 'physical', 'layered-necklace-set',     41.00, null, false, 50, 60, false, true),
  (1, 4, 'physical', 'tortoise-sunglasses',      33.00, null, false, 40, 80, false, true),
  (1, 4, 'physical', 'leather-belt-classic',     27.00, null, false, 55, 200,false, true),
  (1, 4, 'physical', 'beaded-anklet',            11.00, null, false, 75, 10, false, true);
```

```sql
-- ─────────────────────────────────────────
-- TRANSLATIONS (en) — jalankan setelah insert products di atas
-- Gunakan product_id hasil insert (sesuaikan urutan id sesuai hasil insert di project Anda)
-- ─────────────────────────────────────────
insert into public.product_translations (product_id, language_id, title, description, short_description)
select p.id, (select id from public.languages where code = 'en'),
  initcap(replace(p.slug, '-', ' ')),
  'High quality ' || replace(p.slug, '-', ' ') || ' crafted with care. Perfect for everyday use.',
  initcap(replace(p.slug, '-', ' '))
from public.products p
where p.slug in (
  'denim-jacket-classic','leather-sneakers-white','gold-plated-necklace','oversized-knit-sweater',
  'ceramic-vase-set','silver-hoop-earrings','tailored-blazer-black','running-shoes-pro',
  'wireless-earbuds-v2','photoshop-action-pack','minimalist-desk-lamp','pearl-drop-earrings',
  'linen-shirt-summer','canvas-slip-on','minimal-chain-bracelet','plush-teddy-bear',
  'lightroom-presets-vol3','wide-leg-trousers','cropped-denim-jacket','striped-cotton-tee',
  'pleated-midi-skirt','classic-trench-coat','ribbed-tank-top','rose-gold-ring',
  'layered-necklace-set','tortoise-sunglasses','leather-belt-classic','beaded-anklet'
);
```

---

## 13. TOPBAR FEATURE SUMMARY

| Feature         | Trigger           | Component              | State Location         |
|-----------------|-------------------|------------------------|------------------------|
| Location        | Click "📍 Location" | `<LocationModal />`  | zustand `useLocationStore` |
| Currency        | Click "USD ($) ▾"  | `<CurrencyDropdown />` | zustand `useCurrencyStore` |
| Language        | Click "🇺🇸 English ▾" | `<LangDropdown />`  | next-intl locale       |
| Login           | Click "Login"      | `<LoginModal />`       | zustand `useAuthModalStore` |
| Register        | Click "Register"   | Route `/register`      | —                      |

---

## 14. CLOUDFLARE TURNSTILE

- Site key: dari Cloudflare dashboard (masuk ke `.env.local`)
- Komponen: `@marsidev/react-turnstile`
- Token dikirim ke Supabase Edge Function atau API Route untuk validasi
- Tampilkan SETELAH semua field form diisi (lazy load)
- Visual: widget default "managed" theme, auto → light

```tsx
// contoh usage
<Turnstile
  siteKey={process.env.NEXT_PUBLIC_CF_TURNSTILE_SITEKEY!}
  onSuccess={(token) => setTurnstileToken(token)}
  className="mt-4"
/>
```

---

## 15. GOOGLE OAUTH

- Provider: Supabase Auth → Google OAuth
- Scope: `email profile`
- Redirect: `/auth/callback` (Supabase SSR callback route)
- Setelah auth: upsert ke `public.profiles` via trigger atau di callback

```ts
// lib/auth.ts
export async function signInWithGoogle() {
  const supabase = createClient()
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  })
}
```

---

*File ini adalah source of truth untuk semua keputusan visual dan UI. Setiap komponen harus merujuk ke sini sebelum mengimplementasikan styling.*