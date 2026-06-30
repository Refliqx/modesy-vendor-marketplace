# DESIGN.md — Modesy Marketplace Clone
> Visual & data specification untuk reproduksi 99% dari modesy.codingest.com
> Stack: Next.js 14 (App Router) · TailwindCSS v3 · Supabase
> Status: REPLACE TOTAL v2 — menggabungkan spec lama, hasil inspeksi langsung situs asli, dan ekstensi schema e-commerce penuh (multi-image, variasi, review, multi-vendor cart, payment).
> **Source of truth tunggal untuk semua keputusan visual & data. Agent tidak boleh menebak — kalau tidak ada di sini, tanya user, jangan asumsi.**

---

## 0. CATATAN VERSI

- v1 → v2: menambahkan struktur konten penuh homepage (brand section, blog section, newsletter, footer lengkap, mega-menu kategori), location picker 3 tingkat (Country → State → City, bukan 2 tingkat), toast "added to cart", vendor/shop name pada product card, badge jumlah cart/wishlist.
- v2 menambahkan §12.10–§12.14: `product_images`, `product_options` + `product_option_values`, `product_reviews`, `wishlists`, kolom payment di `orders`.
- **Agent DILARANG melakukan live browser check ke modesy.codingest.com.** Semua kebutuhan visual sudah didokumentasikan di file ini. Verifikasi pixel-perfect adalah tanggung jawab user, dilakukan manual di luar sesi agent.

---

## 1. COLOR TOKENS

```css
/* globals.css atau tailwind.config.ts */
--color-primary:        #0BAF9A;   /* Teal accent — Sell Now, Register btn, logo "o", price, active link */
--color-primary-hover:  #099D8A;   /* Hover state primary */
--color-topbar-bg:      #1B2333;   /* Utility bar top (dark navy) */
--color-topbar-text:    #FFFFFF;   /* Text di topbar */
--color-nav-bg:         #FFFFFF;   /* Main navbar background */
--color-body-bg:        #FFFFFF;   /* Page body */
--color-border:         #E5E7EB;   /* Input & card borders */
--color-placeholder:    #9CA3AF;   /* Input placeholder text */
--color-text-main:      #1F2937;   /* Primary body text */
--color-text-muted:     #6B7280;   /* Secondary / muted text */
--color-text-light:     #D1D5DB;   /* Separator text ("Or register with email") */
--color-modal-overlay:  rgba(0,0,0,0.5); /* Login modal backdrop */
--color-success:        #22C55E;   /* Turnstile success checkmark, toast "added to cart" */
--color-discount-badge: #EF4444;   /* Badge "-17%" di product card (red-500) */
--color-footer-bg:      #1B2333;   /* Footer background — sama dengan topbar (dark navy) */
--color-footer-text:    #D1D5DB;   /* Footer body text */
--color-footer-heading: #FFFFFF;   /* Footer column heading */
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
    footer: '#1B2333',
  },
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  },
}
```

---

## 2. TYPOGRAPHY

| Role             | Font  | Weight | Size (desktop) | Line Height |
|------------------|-------|--------|-----------------|-------------|
| Logo "Modesy"    | Inter | 700    | 28px            | 1           |
| Nav links        | Inter | 400    | 14px            | 1.25        |
| Mega-menu heading| Inter | 600    | 14px            | 1.3         |
| Mega-menu link   | Inter | 400    | 13px            | 1.4         |
| Category nav bar | Inter | 400    | 14px            | 1.25        |
| Hero title       | Inter | 700    | 42px            | 1.2         |
| Hero subtitle    | Inter | 400    | 16px            | 1.5         |
| Section title    | Inter | 700    | 22px            | 1.3         |
| Input text       | Inter | 400    | 14px            | 1.5         |
| Button text      | Inter | 600    | 14–15px         | 1           |
| Modal title      | Inter | 700    | 24px            | 1.2         |
| Utility bar      | Inter | 400    | 13px            | 1           |
| Product card title | Inter | 500  | 14px            | 1.4         |
| Product price    | Inter | 700    | 16px            | 1           |
| Footer heading   | Inter | 600    | 15px            | 1.3         |
| Footer link      | Inter | 400    | 14px            | 1.6         |
| Blog card title  | Inter | 600    | 16px            | 1.4         |

---

## 3. LAYOUT STRUCTURE

### 3.1 Topbar (Utility Bar)
```
┌────────────────────────────────────────────────────────────────┐
│ bg: #1B2333 · h-10 (40px) · w-full                            │
│                                                                  │
│ [Contact]  [Sell on Modesy]   ···   [📍 Location] [USD ($) ▾] [🇺🇸 English ▾] [Login] / [Register] │
│ left: flex gap-6 px-6          right: flex gap-4 items-center   │
└────────────────────────────────────────────────────────────────┘
```
- Font: 13px, text-white
- Divider antara Login dan Register: `/` dengan opacity-40
- Hover: underline, opacity-80
- Klik "Location" → modal "Select Location" (lihat §4.5 — Country → State → City)
- Klik "USD ($)" → dropdown currency list
- Klik "🇺🇸 English ▾" → dropdown language toggle
- Klik "Login" → buka `<LoginModal />`
- Klik "Register" → navigasi ke `/register`
- **Mobile:** topbar item disembunyikan kecuali Location, Language, Currency dipindah ke dalam off-canvas "Main Menu" drawer (hamburger), beserta Home / Wishlist / Contact / Blog / Sell on Modesy / Login / Register

### 3.2 Main Navbar
```
┌────────────────────────────────────────────────────────────────┐
│ bg: white · h-16 (64px) · border-b border-gray-100 · shadow-sm│
│                                                                  │
│  [Modesy logo]   [🔍 Search for products, categories or brands] │
│                                                          [🛒 Cart (0)] [♡ Wishlist] [Sell Now btn] │
└────────────────────────────────────────────────────────────────┘
```

**Logo:**
- Source asli: SVG (`/assets/img/logo.svg`), 160×60 viewbox. Untuk clone, render sebagai teks:
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
- Cart: `ShoppingCart` icon (lucide-react) + badge angka di kanan label, format "Cart {count}" — situs asli menampilkan "0" persis di sebelah ikon cart, bukan badge bulat kecil
- Wishlist: `Heart` icon (lucide-react), badge angka jika count > 0
- Badge count: bg-primary text-white text-[10px] rounded-full, posisi absolute -top-1 -right-1 (opsional, alternatif dari format "Cart {count}")

**Sell Now Button:**
- bg: #0BAF9A, text-white
- padding: px-5 py-2.5
- border-radius: 6px
- font-weight: 600, font-size: 14px
- hover: bg #099D8A
- transition: 150ms ease
- Link tujuan: `/sell-on-modesy`

### 3.3 Category Navigation Bar + Mega Menu

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
- Hover: color #0BAF9A, underline, **dan membuka mega-menu dropdown**
- Active/current: color #0BAF9A, font-medium

**Mega-menu (on hover, desktop only):**
- Trigger: hover salah satu top-level category
- Container: absolute top-full left-0, w-full atau w-max, bg-white, shadow-lg, border-t border-gray-100, z-40
- Layout: multi-kolom (3–4 kolom), setiap kolom = 1 sub-kategori (mis. "Women's Clothing") sebagai heading (font-semibold 14px, link), diikuti list sub-sub-kategori (font-normal 13px, link, mt-2 space-y-2)
- Kolom paling kanan: 2–4 thumbnail gambar promo kategori (rounded-md, aspect-square atau aspect-[4/5]), caption nama kategori di bawah/overlay
- Contoh struktur nyata (Clothing): kolom "Women's Clothing" (Dresses, Skirts, Pants & Capris, Sweaters), kolom "Men's Clothing" (Jackets & Coats, Sweaters, Pants & Jeans, Shirts), kolom "Kid's Clothing" (Clothing Sets), kolom gambar (Women's Clothing, Sweaters, Men's Clothing)
- Setiap top-level category memiliki struktur sub-kategori berbeda — lihat §3.3.1 untuk daftar lengkap dari situs asli
- Transisi: `transition-all duration-200 ease-out`, fade + slight translate-y

#### 3.3.1 Struktur Kategori Lengkap (dari situs asli — gunakan sebagai referensi seed kategori)

```
Clothing
├─ Women's Clothing → Dresses, Skirts, Pants & Capris, Sweaters
├─ Men's Clothing → Jackets & Coats, Sweaters, Pants & Jeans, Shirts
└─ Kid's Clothing → Clothing Sets

Shoes
├─ Women's Shoes → Sneakers & Athletic Shoes, Boots, Sandals
├─ Men's Shoes → Sneakers, Boots, Sandals
└─ Kid's Shoes → Booties & Crib Shoes, Slippers

Home & Living
├─ Home Decor → Decorative Pillows, Clocks, Vases
├─ Furniture → Living Room Furniture, Dining Room Furniture
├─ Office → Office & School Supplies
├─ Outdoor & Gardening → Garden Decoration, Plants
└─ Painting → Acrylic, Watercolor, Digital Prints

Jewelry & Accessories
├─ Bags & Purses → Backpacks, Handbags
├─ Necklaces & Accessories → Pendants, Sun Hats, Scarfs
└─ Rings

Toys & Entertainment
├─ Musical Instruments → Guitars, Drums, Stringed Instruments
├─ Video Games
├─ Toys → Electronic Toys, Dolls & Action Figures, Puzzles
├─ Headphones → Over-Ear Headphones, Earbud Headphones
├─ Magazines → Arts Music & Photography, Fashion & Style
├─ Movies → Movies & TV, Blu-Ray
└─ Books → Art & Photography Books, History Books, Poetry Books, Novels

Graphics & Photos
├─ Graphics → Icons, Vectors, Add-ons
├─ Web Elements → Badges Stickers, Banners Ads
├─ Logos → Abstract, Company, Numbers, Objects
└─ Photos → Animals, Architecture & Business, Food & Health, Sports & People, Technology & Travel

Video & Audio
├─ After Effects → Video Overlays & Elements, Product Promo, Video Displays
├─ Premiere Pro → Broadcast Packages, Product Promo, Video Displays
├─ Music → Ambient, Cinematic Music, Classical Music, Corporate
└─ Sound Effects → Cartoon Sounds, Domestic Sounds, Futuristic Sounds, Nature Sounds, Human Sounds

Web Templates & Code
├─ WordPress Templates → Blog & Magazine, Directory & Listing, Real Estate
├─ HTML Templates → Corporate, Creative, Other
├─ PHP Scripts → eCommerce, Miscellaneous, Corporate, Education
├─ Plugins → Widgets
└─ JavaScript & CSS → Calendars, Charts And Graphs
```

> Ini adalah taksonomi 3-level: Top Category → Sub Category → Sub-sub Category. Schema `categories` saat ini (§12.3) flat (tanpa `parent_id`). **Lihat §12.15 untuk migration `parent_id` yang dibutuhkan supaya taksonomi ini bisa direpresentasikan.**

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
│   [Explore Now / Buy Now btn]: bg-gray-900, text-white, px-6 py-3, rounded │
│                                                                  │
│  Dots pagination: bottom-center                                 │
└────────────────────────────────────────────────────────────────┘
```

**Contoh konten asli (untuk dummy seed banner):**
- Slide 1 — Judul: "Buy Nice and Unique Clothes", subtitle: "Discover quality premium basics and trendy essentials at surprisingly affordable prices", CTA: "Explore Now" → link kategori `clothing/womens-clothing`
- Slide 2 — Judul: "Find Backpacks That Best Suit You", subtitle: "Timeless, modern, and feminine pieces made with quality materials and craftsmanship", CTA: "Buy Now" → link kategori `bags-purses/backpacks`

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
│ [Shop By Category] (h2, bold 22px)     [View All →] (teal, 14px, right, → /products) │
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

**Catatan dari situs asli:** grid menampilkan campuran top-level category DAN sub-category dalam satu baris (mis. Clothing, Home & Living, Toys & Entertainment, Women's Clothing, Men's Clothing, Furniture, Necklaces & Accessories, Graphics, Painting, Boots, Decorative Pillows, Handbags — total 12 item, lebih dari satu baris 6-kolom). Setiap item, terlepas dari level taksonominya, link ke slug kategori/sub-kategori terkait.

**Category circles:**
- Size: w-44 h-44 (176px) desktop
- Shape: rounded-full, overflow-hidden
- Image: object-cover, w-full h-full
- Hover: scale-105, transition 200ms, cursor-pointer
- Hover overlay: bg-primary/20 appears on hover, dengan teks "Shop Now →" center (situs asli menampilkan teks "Shop Now" muncul di overlay saat hover)
- Shadow: shadow-md on hover

### 3.6 Banner Promo (di antara product grid sections)
- Dua banner image side-by-side (grid-cols-2 gap-6), full-width container max-w-screen-xl
- Setiap banner: aspect ratio lebar (~3:1 atau 16:6), object-cover, rounded-lg, link ke kategori
- Muncul lebih dari satu kali di homepage (lihat §5 urutan section) — antara Featured Products & New Arrivals, dan lagi sebelum section kategori kedua
- Hover: scale-[1.02] subtle, transition 200ms

### 3.7 Shop By Brand Section
```
┌────────────────────────────────────────────────────────────────┐
│ py-12 px-6 · max-w-screen-xl mx-auto                          │
│ [Shop By Brand] (h2, bold 22px)                                │
│                                                                  │
│ Flex wrap / grid: Adidas · Armani · Burberry · Diesel · Dockers │
│ · Gucci · H&M · Hugo Boss · Lacoste · Lee Cooper · Levi's       │
│ · Mango · Nike · Puma · Tommy Hilfiger · U.S. Polo Assn         │
└────────────────────────────────────────────────────────────────┘
```
- Setiap brand: pill/badge atau text-link sederhana, font 14px, color text-main, hover: color primary
- Link: `/products?brand={id}`
- Layout: flex flex-wrap gap-3, atau grid responsif (tidak ada logo image di versi dasar — text-only chip)
- **Butuh tabel `brands` baru** — lihat §12.16

### 3.8 Latest Blog Posts Section
```
┌────────────────────────────────────────────────────────────────┐
│ py-12 px-6 · max-w-screen-xl mx-auto                          │
│ [Latest Blog Posts] (h2, bold 22px)                             │
│                                                                  │
│ Grid 4 col desktop / 2 col tablet / 1 col mobile:              │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                                │
│  │ img │ │ img │ │ img │ │ img │  (aspect 4:3, rounded-lg)      │
│  │title│ │title│ │title│ │title│                                │
│  │[Category] · {n} months ago│                                  │
│  │excerpt 1 baris             │                                 │
│  └─────┘ └─────┘ └─────┘ └─────┘                                │
└────────────────────────────────────────────────────────────────┘
```
- Card: image rounded-lg mb-3, title font-semibold 16px line-clamp-2, meta row (category pill teal-tinted + "{n} months ago" text-gray-400 text-xs), excerpt text-sm text-gray-500 line-clamp-2
- Total 8 post ditampilkan di homepage (situs asli)
- **Butuh tabel `blog_posts` + `blog_categories` baru** — lihat §12.17. Di luar scope Phase 1-9 inti; tandai sebagai Phase 10 opsional jika user ingin blog penuh, atau render section dengan dummy/static data dulu.

### 3.9 Newsletter Section
- Full-width band, bg-image (`newsletter_bg.jpg`) dengan overlay gelap, text-white center
- Judul: "Join Our Newsletter", bold 24px
- Subtitle: "Join our subscribers list to get the latest news, updates and special offers directly in your inbox", 14px, text-white/80
- Input email + button "Subscribe" (bg-primary), inline form, max-w-md mx-auto
- Muncul juga di footer (versi compact) — lihat §3.10

### 3.10 Footer
```
┌────────────────────────────────────────────────────────────────┐
│ bg: #1B2333 (dark navy) · text-white/70 · py-16 px-6           │
│                                                                  │
│ [Logo] [deskripsi 2 baris]              [Categories]  [Quick Links] [Information] [Newsletter] │
│ [Social icons row]                                                                              │
│ ──────────────────────────────────────────────────────────────│
│ [Payment method icons: visa, mastercard, maestro, amex, discover] │
│ Copyright {year} Modesy - All Rights Reserved.   [Privacy Policy] [Cookie Policy] │
└────────────────────────────────────────────────────────────────┘
```

**Kolom 1 (Brand):**
- Logo putih/inverted
- Deskripsi: "Modesy is a modern e-commerce marketplace where buyers and sellers connect with ease. Whether you are looking to shop for unique items or grow your business by selling online, Modesy is here to help you every step of the way."
- Social icons row (circle bg-white/10, hover bg-primary): Facebook, Twitter/X, Instagram, TikTok, WhatsApp, YouTube, Discord, Telegram, Pinterest, LinkedIn, Twitch, VK, RSS Feed — ikon dari `lucide-react` atau `simple-icons` (lucide tidak punya semua brand icon, pakai `react-icons/si` sebagai fallback untuk brand-specific icons)

**Kolom 2 — Categories:**
Clothing, Shoes, Home & Living, Jewelry & Accessories, Toys & Entertainment, Graphics & Photos, Video & Audio, Web Templates & Code

**Kolom 3 — Quick Links:**
Home, Blog, Shops, Affiliate Program, Help Center

**Kolom 4 — Information:**
Terms & Conditions, About Us

**Kolom 5 — Newsletter:**
- Heading "Newsletter", subtitle singkat, input + tombol Subscribe (versi compact dari §3.9)

**Bottom bar:**
- Border-top border-white/10, pt-6 mt-10, flex justify-between items-center
- Payment icons: visa, mastercard, maestro, amex, discover (image asset, h-6, grayscale atau full color)
- Copyright text kiri: `Copyright {tahun berjalan} Modesy - All Rights Reserved.` — gunakan `new Date().getFullYear()`, JANGAN hardcode tahun
- Link kanan: Privacy Policy · Cookie Policy

**Cookie consent banner:**
- Fixed bottom, full-width, bg-gray-900 text-white, py-4 px-6, flex justify-between items-center
- Teks: "This site uses cookies. By continuing to browse the site, you are agreeing to our use of cookies." + link "Cookie Policy"
- Button "Accept Cookies": bg-primary, px-4 py-2, rounded-md
- Dismiss → simpan preference di cookie/localStorage, jangan tampilkan lagi

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

**Validasi (zod, client + re-validate di server action):**
| Field | Rule |
|---|---|
| First Name | required, min 2, max 50, hanya huruf/spasi/strip |
| Last Name | required, min 2, max 50, hanya huruf/spasi/strip |
| Email Address | required, format email valid, **cek unik via query `profiles`/`auth.users` sebelum submit** |
| Password | required, min 8, harus ada 1 huruf besar + 1 angka |
| Confirm Password | wajib sama dengan Password (`.refine`) |
| Terms checkbox | wajib `true` sebelum submit aktif |
| Turnstile token | wajib ada (non-empty) sebelum submit dikirim ke server |

- Error message tampil di bawah field terkait, text-xs text-red-500, mt-1
- Field invalid: border berubah ke border-red-400
- Submit button disabled selama request berjalan (loading spinner di dalam button, teks "Register" → tetap, hanya tambah spinner kiri teks)
- Setelah submit berhasil → redirect ke `/` (atau halaman verifikasi email jika Supabase mewajibkan konfirmasi email) + toast sukses
- Setelah submit gagal (mis. email sudah terdaftar) → toast error + reset Turnstile widget (lihat AGENTS §11 Common Pitfalls)

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
- "Forgot Password?" — right-aligned, text-sm, text-primary, link ke `/forgot-password`
- "Login" button — full width, bg-primary
- "Don't have an account? Register" — center, text-sm, Register adalah text-primary underline

**Validasi:**
- Email Address: required, format email
- Password: required, min 1 (server yang menentukan valid/tidak — jangan bocorkan rule password di sisi login)
- Error auth (kombinasi salah) → tampil sebagai 1 pesan umum di atas form: "Email or password is incorrect." text-sm text-red-500 bg-red-50 p-3 rounded-md mb-4. **Jangan bedakan pesan "email tidak ditemukan" vs "password salah"** (mencegah user enumeration).
- Rate-limit: setelah 5x gagal dalam 10 menit → tampilkan pesan tambahan "Too many attempts, please try again later." (gunakan Supabase Auth rate limit native, jangan reimplement)

### 4.3 Language Switcher Dropdown

**Trigger:** "🇺🇸 English ▾" di topbar

**Dropdown card:**
- bg-white, border border-gray-200, rounded-md, shadow-lg
- Position: absolute, top-full, right-0, mt-1, w-44
- z-index: z-50

**Options (sesuai situs asli — hanya 2 bahasa):**
```
🇺🇸  English         ✓ (if active)
🇸🇦  Arabic
```
- Each option: px-4 py-3, flex items-center gap-3
- Flag: image asset (situs asli pakai file flag JPG/PNG, bukan emoji) — clone pakai `react-country-flag` atau static asset
- Hover: bg-gray-50
- Active: text-primary, font-medium
- RTL support: ketika Arabic aktif, direction: rtl pada html element, route prefix `/ar`

**Implementation:**
- `next-intl`
- Locale routes: `/en/...` (atau root tanpa prefix untuk default) dan `/ar/...`
- RTL: tambah `dir="rtl"` pada `<html>` untuk Arabic

### 4.4 Currency Switcher Dropdown

**Trigger:** "USD ($) ▾" di topbar

**Dropdown card:**
- bg-white, border border-gray-200, rounded-md, shadow-lg
- w-52, max-h-72, overflow-y-auto
- scrollbar-thin (tailwind-scrollbar plugin)

**Currency list (9 currency — sesuai situs asli & schema):**
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
- Konversi rate: **dari tabel `currencies` Supabase** (kolom `exchange_rate`), bukan API eksternal — sudah dikonfirmasi di AGENTS.md §10
- Format angka dengan `Intl.NumberFormat`
- Persist pilihan currency di cookie/localStorage agar konsisten antar reload (rehydrate zustand store dari situ)

### 4.5 Location Picker

**Trigger:** "📍 Location" di topbar

> **Koreksi dari spec v1:** situs asli memakai 3 tingkat (Country → State → City), bukan 2 tingkat. Judul modal: "Select Location", subtitle: "Filter products by location".

**Modal:**
- Modal style (seperti login modal), lebar ~480px
- Title: "Select Location"
- Subtitle: "Filter products by location" (text-sm text-gray-500, mb-4)

**Step 1 — Country:**
- Searchable combobox (react-select atau cmdk)
- List negara dengan flag emoji + nama
- Placeholder: "Search country..."

**Step 2 — State:**
- Muncul setelah country dipilih
- Dropdown state berdasarkan country yang dipilih
- Library: `country-state-city` (npm package)

**Step 3 — City:**
- Muncul setelah state dipilih
- Dropdown city berdasarkan state yang dipilih
- Library: `country-state-city`

**Confirm button:**
- "Select Location", full width, bg-primary
- Disabled selama belum ada minimal Country terpilih

**Display di topbar setelah dipilih:**
```
📍 Jakarta, ID
```
(format: `{City atau State}, {Country code}` — gunakan yang paling spesifik yang terpilih)

### 4.6 Product Card (reusable — dipakai di semua product grid section)

```
┌───────────────────┐
│  [discount badge] │  ← top-left, hanya jika discount_percent not null
│                    │
│      image         │  aspect-square, object-cover, dari product_images (is_main=true)
│                    │
│         [♡]        │  ← top-right, wishlist toggle, muncul on hover (desktop) / selalu (mobile)
├───────────────────┤
│ Vendor / shop name  │  text-xs text-gray-400, link ke /profile/{shop_slug} — cth: "Trendshop", "Admin"
│ Product title        │  text-sm font-medium text-text-main, line-clamp-2
│ ★★★★☆ (24)          │  text-xs text-gray-500, hanya jika ada rating (lihat §12.13 product_reviews)
│ $24.00  $32.00       │  price (primary, bold) + strikethrough harga asli jika diskon
│ [Add to Cart] / [Request a Quote] │  hanya jika produk tanpa harga tetap → CTA berbeda
└───────────────────┘
```

**Spesifikasi:**
- Container: bg-white, rounded-lg (8px), border border-gray-100, overflow-hidden
- Hover: shadow-md, transition-shadow 200ms
- Image wrapper: aspect-square, bg-gray-50, relative
- **Image source:** `product_images` table, ambil row `is_main = true`, fallback ke `row_order` terkecil jika tidak ada `is_main`. Jika produk belum punya baris di `product_images` sama sekali → fallback ke placeholder deterministik `https://picsum.photos/seed/product-{id}/400/400` (lihat §12.12 catatan migrasi)
- Discount badge: absolute top-2 left-2, bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md, format `-{discount_percent}%`
- Wishlist icon: absolute top-2 right-2, w-8 h-8 rounded-full bg-white/90 flex items-center justify-center, Heart icon lucide 16px, hover: text-red-500, filled merah jika produk sudah ada di `wishlists` user
- Content padding: p-3
- Vendor/shop name label: mb-1, render dari join `vendors.shop_name` via `products.vendor_id`
- Title: mb-1.5, min-h dua baris (line-clamp-2) biar grid rata
- Rating: mb-1.5, Star icon lucide fill-yellow-400, render rata-rata dari `product_reviews.rating` (lihat §12.13) — jika belum ada review sama sekali, sembunyikan baris rating sepenuhnya (jangan render "0 reviews")
- Price row: flex items-center gap-2
  - Harga jual (setelah diskon jika ada): text-primary font-bold text-base
  - Harga asli (jika diskon): text-gray-400 text-sm line-through
  - Harga normal (tanpa diskon): text-text-main font-bold text-base, tanpa strikethrough
  - **Jika produk tidak punya harga tetap (price = null/0 dan ada variasi tanpa base price)**: tampilkan link teks "Request a Quote" sebagai pengganti price row, style text-sm text-gray-700 underline, link ke PDP
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
│                                                                  │
│  [Load More] ← khusus Featured Products section (lihat catatan) │
└────────────────────────────────────────────────────────────────┘
```

- Header sama persis dengan "Shop By Category" (lihat §3.5): h2 bold 22px kiri, "View All →" text-primary 14px kanan
- Grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`, gap-4 mobile / gap-6 desktop
- Limit fetch per section: 10 produk awal (5 kolom × 2 baris desktop)
- **Featured Products section punya tombol "Load More"** di bawah grid (situs asli) — klik akan fetch 10 produk berikutnya (offset pagination) dan append ke grid tanpa reload halaman. Section lain (Special Offers, New Arrivals, per-kategori) tidak punya Load More — hanya "View All →"
- Section ini reuse `<ProductCard />` yang sama, hanya data source query yang beda:
  - **Special Offers**: `.not('discount_percent', 'is', null)`
  - **Featured Products**: `.eq('is_featured', true)` + Load More pagination
  - **New Arrivals**: `.order('created_at', { ascending: false })`
  - **Clothing** / **Jewelry & Accessories**: filter `category_id` via slug kategori terkait
- "View All →" link mengarah ke `/products` (listing umum dengan filter) untuk Shop By Category & New Arrivals, atau ke route kategori spesifik (`/clothing`, `/jewelry-accessories`) untuk section per-kategori

### 4.8 Product Image (sumber data, urutan prioritas)

> Schema sekarang **sudah punya** tabel `product_images` (lihat §12.12) — ini solusi permanen.
> **PRASYARAT:** migration §12.12 harus sudah dijalankan & ada data di tabel sebelum komponen di-build menggunakannya.
>
> Urutan resolusi gambar di `<ProductCard />` dan PDP:
> 1. Query `product_images` WHERE `product_id` = X AND `is_main` = true → pakai `image_url`
> 2. Jika tidak ada row `is_main`, pakai row dengan `row_order` terkecil
> 3. Jika produk belum punya baris sama sekali di `product_images` (data lama/belum migrasi) → fallback placeholder deterministik: `https://picsum.photos/seed/product-{id}/400/400`
> Fallback #3 wajib dipertahankan di kode sampai user mengonfirmasi semua produk existing sudah punya minimal 1 baris di `product_images`.

### 4.9 Product Detail Page (PDP)

**Layout:** 12-kolom desktop (`grid grid-cols-12 gap-8`)
- **Kiri (col-span-7):** Embla Carousel image slider
  - Main slide: aspect-square atau aspect-[4/5], object-cover, rounded-lg
  - Thumbnail strip di bawah: row scroll horizontal, w-16 h-16 tiap thumbnail, border-2 border-primary pada thumbnail aktif
  - Sumber data: semua row `product_images` untuk `product_id` ini, urut by `row_order`
- **Kanan (col-span-5):**
  - Vendor/shop name (link ke profile), mb-2
  - Title: text-2xl font-bold, mb-2
  - Rating row (jika ada review): stars + "({count} reviews)" link anchor ke section review di bawah
  - Price block: harga dinamis (lihat di bawah), text-3xl font-bold text-primary
  - **Variation selector:** untuk setiap row di `product_options` (mis. "Color", "Size") render sebagai group pill/swatch buttons dari `product_option_values` terkait. Pilihan user disimpan di local state PDP.
  - **Price dinamis:** `final_price = base_price + sum(price_modifier dari setiap option_value yang dipilih)`, lalu terapkan `discount_percent` jika ada, lalu format dengan currency aktif. Update real-time saat user ganti pilihan variasi (tanpa reload).
  - **Stock validation:** stock yang dipakai untuk validasi qty maksimum adalah `stock` dari kombinasi `product_option_values` yang dipilih (bukan `products.stock` global) — jika produk tidak punya variasi, fallback ke `products.stock`.
  - Quantity stepper (− / input / +), clamp ke stock tersedia
  - Tombol "Add to Cart" (full width / w-auto, bg-primary) — disabled & teks berubah jadi "Out of Stock" (bg-gray-300, text-gray-500, cursor-not-allowed) jika stock = 0 untuk kombinasi terpilih
  - Tombol wishlist (ikon Heart, toggle outline/filled) di sebelah Add to Cart
- **Section di bawah (full width):** Description (dari `product_translations.description`), lalu Reviews (lihat §4.10)

### 4.10 Product Reviews Section (PDP)

- Heading: "Customer Reviews ({count})", bold 20px
- Rating summary: rata-rata besar (mis. "4.5") + bintang + total count, di kiri; breakdown bar 5★→1★ (horizontal bar chart sederhana) di kanan
- List review: avatar (inisial atau `profiles.avatar_url`) + nama + tanggal (`date-fns` relative format, mis. "2 months ago") + bintang individual + teks review
- Form tambah review (hanya muncul untuk user yang login DAN sudah pernah membeli produk ini — lihat AGENTS §13 validasi business rule) — star picker (1-5, klik) + textarea + submit
- Pagination/load more jika review > 10

### 4.11 Cart Page & Multi-Vendor Grouping

**Route:** `/cart`

**Layout:**
- Breadcrumb "Home / Cart"
- Title "Shopping Cart ({total item count})"
- **Produk dikelompokkan (Group By) berdasarkan `vendor_id`.** Setiap grup vendor:
  - Header grup: shop logo (kecil, w-8 h-8 rounded-full) + shop name (font-semibold), border-bottom
  - List item di bawah header: image thumbnail (w-20 h-20) + title + variasi terpilih (text-xs text-gray-500, mis. "Color: Red, Size: M") + price satuan + qty stepper + subtotal + tombol hapus (X icon)
  - Footer grup: "Shipping for {shop name}: ${amount}" (text-sm, kanan), dihitung independen per vendor (tidak digabung ongkir semua vendor)
- Summary panel (kanan, sticky, w-80 desktop): subtotal semua item, total shipping (sum semua grup), grand total, tombol "Proceed to Checkout" (full width bg-primary)
- Empty state: ikon cart besar abu-abu + teks "Your cart is empty" + tombol "Continue Shopping" → `/`

**State management:**
- Source kebenaran (source of truth): tabel `cart_items` Supabase (server-synced), bukan hanya local state
- Zustand store `useCartStore` sebagai cache client-side untuk render cepat, tapi setiap mutasi (add/update qty/remove) WAJIB lewat Server Action yang menulis ke `cart_items` lalu re-fetch/revalidate
- Grouping by vendor dilakukan di selector/computed, bukan disimpan terpisah di DB

### 4.12 Toast Notifications

**"Product successfully added to your cart!"**
- Posisi: fixed top-right (atau bottom-center mobile), bg-white, shadow-lg, rounded-md, border-l-4 border-success
- Icon check (lucide `CheckCircle2`, text-success) + teks, p-4, auto-dismiss 3s, bisa di-close manual (X kecil)
- Trigger: setiap kali Add to Cart sukses (dari PDP atau quick-add di product card jika ada)

**General error toast:**
- Sama style, border-l-4 border-red-500, icon `AlertCircle`
- Trigger: gagal network, gagal validasi server-side, dll.

---

## 5. PAGE SECTIONS ORDER (Homepage)

```
1. Topbar (utility bar)
2. Main Navbar
3. Category Nav (dengan mega-menu on hover)
4. Hero Carousel (full-width, ~480px tall, 2 slide)
5. Shop By Category (grid circles, campuran top-level + sub-category, 12 item)
6. Special Offers (product grid, discount_percent not null)
7. Banner Promo #1 (2 banner side-by-side)
8. Featured Products (product grid, is_featured = true, + tombol Load More)
9. New Arrivals (product grid, order by created_at desc)
10. Banner Promo #2 (2-3 banner)
11. Shop By Category — Clothing (product grid, category slug 'clothing')
12. Shop By Category — Jewelry & Accessories (product grid, category slug 'jewelry-accessories')
13. Shop By Brand (chip/text list brand)
14. Latest Blog Posts (grid 4 kolom, 8 post)
15. Newsletter Section (full-width band)
16. Footer (5 kolom + bottom bar)
17. Cookie Consent Banner (fixed, dismiss-able)
```

> Urutan ini final berdasarkan inspeksi langsung halaman utama situs asli. Jangan ubah urutan tanpa update bagian ini dulu.

---

## 6. BREADCRUMB

- Font: text-sm, color #6B7280
- Active page: text-gray-900 font-medium
- Separator: "/" dengan mx-1
- Container: max-w-screen-xl mx-auto px-6, py-4

---

## 7. RESPONSIVE BREAKPOINTS

| Breakpoint | Width    | Behavior                                                          |
|------------|----------|--------------------------------------------------------------------|
| mobile     | < 640px  | Topbar disembunyikan → off-canvas drawer; category nav → hamburger "Categories"; cart/wishlist label disembunyikan (ikon saja) |
| tablet     | 640-1024 | 3-col category grid; product grid 3-col                           |
| desktop    | > 1024px | Full layout, 6-col category grid; product grid 5-col              |

---

## 8. SPACING SYSTEM

Gunakan Tailwind default scale:
- Section padding: `py-12` (48px vertical)
- Container: `max-w-screen-xl mx-auto px-6`
- Input margin bottom: `mb-3`
- Card padding: `p-8` (modal/form), `p-3` (product card)
- Button padding: `px-6 py-3` (standard), `px-5 py-2.5` (compact)

---

## 9. ANIMATION & TRANSITIONS

- Dropdown open/close: `transition-all duration-200 ease-out` + scale-y dari 0.95→1
- Mega-menu open/close: fade + translate-y-1→0, duration-200
- Modal open: `transition opacity + scale (0.95→1) duration-200`
- Carousel slide: `translateX` dengan `transition-transform duration-500 ease-in-out`
- Category hover scale: `transition-transform duration-200 hover:scale-105`
- Button hover: `transition-colors duration-150`
- Toast in/out: slide dari kanan (atau bawah mobile) + fade, duration-250

Gunakan `framer-motion` untuk modal masuk/keluar dan toast (AnimatePresence).

---

## 10. ICONS

Gunakan `lucide-react` untuk semua ikon umum:
- Cart: `ShoppingCart`
- Wishlist: `Heart`
- Search: `Search`
- Location: `MapPin`
- Chevron/Arrow: `ChevronLeft`, `ChevronRight`, `ChevronDown`
- Close: `X`
- Check: `Check`, `CheckCircle2` (toast sukses)
- Alert: `AlertCircle` (toast error)
- Arrow right: `ArrowRight`
- Rating: `Star`

Untuk social icon brand-spesifik di footer (Facebook, X, Instagram, TikTok, WhatsApp, YouTube, Discord, Telegram, Pinterest, LinkedIn, Twitch, VK) yang tidak tersedia lengkap di `lucide-react`, gunakan `react-icons/si` (Simple Icons) sebagai pelengkap — JANGAN gunakan logo brand sebagai raster image kecuali aset resmi disediakan user.

---

## 11. LIBRARY STACK (Next.js ecosystem)

| Kebutuhan               | Library                          |
|--------------------------|-----------------------------------|
| UI components base      | shadcn/ui (Radix UI primitives)  |
| Icons                    | lucide-react + react-icons/si (social) |
| Animasi                  | framer-motion                    |
| State management         | zustand                          |
| Auth                     | @supabase/ssr + supabase-js      |
| Form handling            | react-hook-form + zod            |
| Internasionalisasi       | next-intl                        |
| Country/State/City data  | country-state-city                |
| Country flag             | react-country-flag (atau static asset, lihat §4.3) |
| Currency conversion      | data dari tabel `currencies` Supabase (BUKAN API eksternal) |
| Carousel                 | embla-carousel-react             |
| Cloudflare Turnstile     | @marsidev/react-turnstile        |
| Dropdown combobox        | cmdk                              |
| Tailwind scrollbar       | tailwind-scrollbar               |
| Date utils               | date-fns                          |
| Image optimization       | next/image (built-in)            |
| HTTP client              | ky atau fetch native              |
| Toast notifications      | sonner (atau shadcn/ui toast — pilih satu, jangan mix) |

---

## 12. SUPABASE SCHEMA

> Schema aktual dari database. Jangan buat ulang tabel yang sudah ada — ini referensi lengkap (existing + ekstensi baru) untuk query, join, dan TypeScript types.
> **Bagian §12.2–§12.9 = schema existing (sudah ada/sudah migrasi sebagian, Phase 1-5).**
> **Bagian §12.10–§12.17 = ekstensi baru (Phase 6-9) — migration WAJIB dijalankan manual oleh user di Supabase SQL Editor sebelum agent membangun komponen yang bergantung padanya.**

### 12.1 Custom Enums

```sql
create type user_role    as enum ('buyer', 'vendor', 'admin');
create type product_type  as enum ('physical', 'digital');
create type order_status  as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');
```

> **Catatan migrasi:** schema existing (§12.3 lama) memakai `varchar` untuk `order_status`/`payment_status`. Jika ingin pindah ke enum di atas, butuh migration `alter column ... type ... using ...`. Tidak wajib — boleh tetap varchar jika user tidak ingin migrasi tambahan. Tandai sebagai opsional di AGENTS.md.

### 12.2 Entity Relationship Overview (ringkas)

```
auth.users 1:1 profiles 1:1 vendors 1:N products
products 1:N product_images
products 1:N product_options 1:N product_option_values
products 1:N product_reviews (N:1 auth.users)
products 1:N cart_items (N:1 auth.users) — grouped by vendor_id di UI
products 1:N order_items (N:1 orders) — grouped by vendor_id di UI
products N:1 categories (categories punya parent_id self-reference, lihat §12.15)
products N:1 brands (lihat §12.16)
auth.users 1:N wishlists N:1 products
```

### 12.3 Tabel Existing (referensi — JANGAN create ulang)

```sql
-- LANGUAGES
create table public.languages (
  id             int4        primary key generated always as identity,
  name           varchar     not null,
  code           varchar     not null unique,
  text_direction varchar,
  is_default     bool        default false,
  status         bool        default true,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- CURRENCIES
create table public.currencies (
  id            int4        primary key generated always as identity,
  name          varchar     not null,
  code          varchar     not null unique,
  symbol        varchar     not null,
  exchange_rate numeric     not null,
  is_default    bool        default false,
  status        bool        default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- PROFILES
create table public.profiles (
  id           uuid        primary key references auth.users(id) on delete cascade,
  full_name    varchar     not null default '',
  role         user_role   default 'buyer',
  avatar_url   text,
  phone_number varchar,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- VENDORS
create table public.vendors (
  id                      int4    primary key generated always as identity,
  user_id                 uuid    unique references auth.users(id) on delete set null,
  shop_name               varchar not null unique,
  shop_slug               varchar not null unique,
  shop_logo               text,
  shop_description        text,
  balance                 numeric default 0,
  custom_commission_rate  numeric,
  is_verified             bool    default false,
  status                  bool    default true,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

-- CATEGORIES (translatable)
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

-- PRODUCTS (translatable)
create table public.products (
  id                int4         primary key generated always as identity,
  vendor_id         int4         references public.vendors(id) on delete set null,
  category_id       int4         references public.categories(id) on delete set null,
  type              product_type not null,
  slug              varchar      not null unique,
  price             numeric      not null,
  discount_percent  numeric,                    -- nullable, 1-99. NOT NULL = masuk Special Offers
  is_featured       bool         default false, -- manual flag untuk section Featured Products
  stock             int4         not null default 0,
  weight            int4,                          -- gram, nullable for digital
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

-- CART
create table public.cart_items (
  id         int4        primary key generated always as identity,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  product_id int4        not null references public.products(id) on delete cascade,
  quantity   int4        not null default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, product_id)
);

-- ORDERS
create table public.orders (
  id                   int4    primary key generated always as identity,
  user_id              uuid    references auth.users(id) on delete set null,
  order_number         varchar not null unique,
  total_price          numeric not null,
  total_shipping_cost  numeric not null default 0,
  payment_status       varchar,
  payment_method       varchar,
  shipping_address     text    not null,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
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
  order_status      varchar,
  tracking_number   varchar,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);
```

### 12.4 RLS Policies (existing)

```sql
alter table public.profiles enable row level security;
create policy "profiles: read own"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles for update using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles for insert with check (auth.uid() = id);

alter table public.cart_items enable row level security;
create policy "cart: all own" on public.cart_items
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.orders enable row level security;
create policy "orders: read own" on public.orders for select using (auth.uid() = user_id);

alter table public.order_items enable row level security;
create policy "order_items: read via order" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

alter table public.languages  enable row level security;
alter table public.currencies enable row level security;
create policy "languages: public read"  on public.languages  for select using (true);
create policy "currencies: public read" on public.currencies for select using (true);

alter table public.categories             enable row level security;
alter table public.category_translations  enable row level security;
create policy "categories: public read"            on public.categories            for select using (status = true);
create policy "category_translations: public read" on public.category_translations for select using (true);

alter table public.products             enable row level security;
alter table public.product_translations enable row level security;
create policy "products: public read"            on public.products            for select using (status = true and is_draft = false);
create policy "product_translations: public read" on public.product_translations for select using (true);

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

### 12.6 TypeScript Types

```bash
npx supabase gen types typescript --project-id <id> > src/types/supabase.ts
```

```ts
import type { Database } from '@/types/supabase'

type Profile             = Database['public']['Tables']['profiles']['Row']
type Currency            = Database['public']['Tables']['currencies']['Row']
type Language            = Database['public']['Tables']['languages']['Row']
type Category            = Database['public']['Tables']['categories']['Row']
type Product             = Database['public']['Tables']['products']['Row']
type CartItem            = Database['public']['Tables']['cart_items']['Row']
type Order               = Database['public']['Tables']['orders']['Row']
type OrderItem           = Database['public']['Tables']['order_items']['Row']
type Vendor              = Database['public']['Tables']['vendors']['Row']
type ProductImage        = Database['public']['Tables']['product_images']['Row']
type ProductOption       = Database['public']['Tables']['product_options']['Row']
type ProductOptionValue  = Database['public']['Tables']['product_option_values']['Row']
type ProductReview       = Database['public']['Tables']['product_reviews']['Row']
type Wishlist            = Database['public']['Tables']['wishlists']['Row']
type Brand               = Database['public']['Tables']['brands']['Row']
```

> **Setiap kali ada migration baru di §12.10–§12.17, types WAJIB di-generate ulang sebelum agent mulai coding terhadap tabel terkait. Ini bukan opsional.**

### 12.7 Seed Data (Languages & Currencies — existing)

```sql
insert into public.languages (name, code, text_direction, is_default, status) values
  ('English', 'en', 'ltr', true,  true),
  ('Arabic',  'ar', 'rtl', false, true);

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

### 12.8 Migration Phase 5 (existing — sudah/seharusnya sudah dijalankan)

```sql
alter table public.products
  add column if not exists discount_percent numeric,
  add column if not exists is_featured bool default false;
```

### 12.9 Dummy Seed Data Phase 5 (existing — referensi, jangan dijalankan ulang jika sudah ada)

> Lihat riwayat seed produk Special Offers / Featured / New Arrivals / Clothing / Jewelry yang sudah dijalankan di Phase 5 (28 produk dummy + translations EN). Tidak diulang di sini untuk efisiensi token — cek riwayat migration project untuk detail exact value jika perlu rollback/reset.

---

### 12.10 ⚠️ MIGRATION BARU — Product Images (Phase 6, PRASYARAT)

> **Dijalankan manual oleh user di Supabase SQL Editor — bukan tugas agent.**
> Setelah migration ini jalan, agent WAJIB generate ulang types (§12.6) sebelum membangun `<ProductCard />` versi baru atau PDP slider.

```sql
create table public.product_images (
  id          int4        primary key generated always as identity,
  product_id  int4        not null references public.products(id) on delete cascade,
  image_url   text        not null,
  is_main     bool        default false,
  row_order   int4        default 0,
  created_at  timestamptz default now()
);

alter table public.product_images enable row level security;
create policy "product_images: public read" on public.product_images for select using (true);
```

**Catatan migrasi data lama:** produk yang sudah ada (seed Phase 5) belum punya baris di tabel ini. Komponen tetap harus fallback ke placeholder picsum (§4.8) untuk produk yang belum punya `product_images`. Seed image untuk 28 produk dummy lama adalah tugas opsional user, bukan tugas wajib agent kecuali diminta eksplisit.

### 12.11 ⚠️ MIGRATION BARU — Product Variations (Phase 6, PRASYARAT)

```sql
create table public.product_options (
  id         int4        primary key generated always as identity,
  product_id int4        not null references public.products(id) on delete cascade,
  name       varchar     not null,         -- contoh: 'Color', 'Size'
  created_at timestamptz default now()
);

create table public.product_option_values (
  id             int4        primary key generated always as identity,
  option_id      int4        not null references public.product_options(id) on delete cascade,
  value          varchar     not null,     -- contoh: 'Red', 'XL'
  price_modifier numeric     default 0,    -- ditambahkan/dikurangi dari products.price
  stock          int4        default 0     -- stock spesifik untuk kombinasi ini
);

alter table public.product_options enable row level security;
alter table public.product_option_values enable row level security;
create policy "product_options: public read"       on public.product_options       for select using (true);
create policy "product_option_values: public read" on public.product_option_values for select using (true);
```

> **Catatan desain:** schema ini per-option-value, bukan per-kombinasi (tidak ada tabel "variant" gabungan Color×Size dengan SKU sendiri). Artinya stock & price_modifier dihitung dari SUM tiap option_value yang dipilih, bukan dari satu baris SKU unik. Ini cukup untuk kebanyakan kasus Modesy clone, tapi **tidak mendukung kombinasi spesifik** (mis. "Red + XL" out of stock tapi "Red + M" tersedia, padahal stock Red sendiri > 0). Jika produk butuh stock per-kombinasi yang presisi, perlu tabel tambahan `product_variants` (SKU gabungan) — **di luar scope saat ini, tandai sebagai catatan teknis, jangan implementasikan tanpa instruksi eksplisit user.**

### 12.12 ⚠️ MIGRATION BARU — Product Reviews (Phase 6, PRASYARAT)

```sql
create table public.product_reviews (
  id         int4        primary key generated always as identity,
  user_id    uuid        not null references auth.users(id) on delete set null,
  product_id int4        not null references public.products(id) on delete cascade,
  rating     int4        not null check (rating >= 1 and rating <= 5),
  review     text,
  created_at timestamptz default now()
);

alter table public.product_reviews enable row level security;
create policy "product_reviews: public read" on public.product_reviews for select using (true);
create policy "product_reviews: insert own"  on public.product_reviews for insert with check (auth.uid() = user_id);
create policy "product_reviews: update own"  on public.product_reviews for update using (auth.uid() = user_id);
create policy "product_reviews: delete own"  on public.product_reviews for delete using (auth.uid() = user_id);
```

> **Business rule (lihat juga AGENTS.md §13):** form review hanya boleh tampil untuk user yang sudah pernah membeli produk tersebut (cek `order_items` join `orders` dengan `user_id` = current user DAN `product_id` = produk ini DAN `order_status` = 'delivered' atau setara). Validasi ini WAJIB di server action, tidak cukup hanya disembunyikan di UI.
> Unique constraint `(user_id, product_id)` TIDAK ditambahkan di schema ini secara default — putuskan dengan user apakah 1 user boleh review 1 produk lebih dari sekali (mis. setelah re-order). Default rekomendasi: tambahkan `unique(user_id, product_id)` kecuali user minta sebaliknya.

### 12.13 ⚠️ MIGRATION BARU — Wishlists (Phase 6, PRASYARAT)

```sql
create table public.wishlists (
  id         int4        primary key generated always as identity,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  product_id int4        not null references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table public.wishlists enable row level security;
create policy "wishlists: all own" on public.wishlists
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

### 12.14 ⚠️ MIGRATION BARU — Payment Extension on Orders (Phase 8, PRASYARAT)

```sql
alter table public.orders
  add column if not exists payment_intent_id varchar,  -- Stripe PaymentIntent ID
  add column if not exists session_id        varchar,  -- Stripe Checkout Session ID
  add column if not exists snap_token        varchar;  -- Midtrans Snap token
```

> Pilih SATU payment gateway untuk implementasi awal (Stripe ATAU Midtrans) — jangan implementasikan dua-duanya sekaligus tanpa instruksi eksplisit. Kolom disiapkan untuk keduanya supaya tidak perlu migration ulang jika nanti ditambah gateway kedua.

### 12.15 ⚠️ MIGRATION OPSIONAL — Kategori Bertingkat (`parent_id`)

> **Belum dikonfirmasi user — JANGAN jalankan tanpa instruksi eksplisit.** Diperlukan jika ingin merepresentasikan taksonomi 3-level di §3.3.1 secara relasional (saat ini `categories` flat).

```sql
alter table public.categories
  add column if not exists parent_id int4 references public.categories(id) on delete set null;
```

Dengan ini, top-level category punya `parent_id = null`, sub-category punya `parent_id` = id top-level, sub-sub-category punya `parent_id` = id sub-category. Query mega-menu jadi recursive/self-join 2 level.

**Alternatif tanpa migration:** jika user tidak ingin ubah schema, mega-menu bisa dibangun dengan data hardcoded dari §3.3.1 di file config TypeScript (`lib/category-tree.ts`), terlepas dari `categories` table di DB yang tetap flat untuk keperluan `products.category_id`. **Ini adalah default sampai user memutuskan sebaliknya.**

### 12.16 ⚠️ MIGRATION OPSIONAL — Brands

> **Belum dikonfirmasi user — JANGAN jalankan tanpa instruksi eksplisit.** Diperlukan untuk section "Shop By Brand" (§3.7) dan filter `/products?brand={id}`.

```sql
create table public.brands (
  id     int4    primary key generated always as identity,
  name   varchar not null unique,
  slug   varchar not null unique,
  status bool    default true
);

alter table public.products
  add column if not exists brand_id int4 references public.brands(id) on delete set null;

alter table public.brands enable row level security;
create policy "brands: public read" on public.brands for select using (status = true);
```

**Alternatif tanpa migration:** render "Shop By Brand" sebagai static list (16 brand dari §3.7) tanpa relasi DB, link `/products?brand={slug}` filter via query string ke kolom teks bebas — **ini bukan rekomendasi jangka panjang**, hanya jika user ingin skip migration brand sepenuhnya.

### 12.17 ⚠️ MIGRATION OPSIONAL — Blog

> **Belum dikonfirmasi user — JANGAN jalankan tanpa instruksi eksplisit.** Di luar inti marketplace; hanya untuk section "Latest Blog Posts" (§3.8). Tandai sebagai Phase 10 terpisah jika user ingin blog fungsional penuh (CMS-lite). Sebelum migration ini ada, render section dengan data statis/dummy di kode, JANGAN bikin tabel tanpa konfirmasi.

```sql
create table public.blog_categories (
  id   int4    primary key generated always as identity,
  name varchar not null,
  slug varchar not null unique
);

create table public.blog_posts (
  id          int4        primary key generated always as identity,
  category_id int4        references public.blog_categories(id) on delete set null,
  author_id   uuid        references auth.users(id) on delete set null,
  slug        varchar     not null unique,
  title       varchar     not null,
  excerpt     varchar,
  content     text        not null,
  cover_image text,
  status      bool        default true,
  created_at  timestamptz default now()
);

alter table public.blog_posts      enable row level security;
alter table public.blog_categories enable row level security;
create policy "blog_posts: public read"      on public.blog_posts      for select using (status = true);
create policy "blog_categories: public read" on public.blog_categories for select using (true);
```

---

## 13. KEY FETCH PATTERNS (REFERENSI — DETAIL LENGKAP DI AGENTS.md §9)

Lihat AGENTS.md §9 "Database Schema Reference" untuk contoh query lengkap setiap section homepage, termasuk join `product_images`, `product_options`, dan `product_reviews` aggregate.

---

## 14. TOPBAR FEATURE SUMMARY

| Feature   | Trigger              | Component               | State Location              |
|-----------|------------------------|--------------------------|------------------------------|
| Location  | Click "📍 Location"   | `<LocationModal />`      | zustand `useLocationStore`  |
| Currency  | Click "USD ($) ▾"     | `<CurrencyDropdown />`   | zustand `useCurrencyStore`  |
| Language  | Click "🇺🇸 English ▾"  | `<LangDropdown />`       | next-intl locale             |
| Login     | Click "Login"          | `<LoginModal />`         | zustand `useAuthModalStore` |
| Register  | Click "Register"       | Route `/register`        | —                            |
| Cart      | Click "🛒 Cart"        | Route `/cart`             | server (`cart_items`) + zustand cache |
| Wishlist  | Click "♡ Wishlist"     | Route `/wishlist`         | server (`wishlists`)        |

---

## 15. CLOUDFLARE TURNSTILE

- Site key: dari Cloudflare dashboard (masuk ke `.env.local`)
- Komponen: `@marsidev/react-turnstile`
- Token dikirim ke Supabase Edge Function atau API Route untuk validasi
- Tampilkan SETELAH semua field form diisi (lazy load)
- Visual: widget default "managed" theme, auto → light
- **Reset widget** (re-render dengan key baru) setiap kali submit form gagal — token Turnstile single-use, jangan kirim token basi.

```tsx
<Turnstile
  siteKey={process.env.NEXT_PUBLIC_CF_TURNSTILE_SITEKEY!}
  onSuccess={(token) => setTurnstileToken(token)}
  className="mt-4"
/>
```

---

## 16. GOOGLE OAUTH

- Provider: Supabase Auth → Google OAuth
- Scope: `email profile`
- Redirect: `/auth/callback` (Supabase SSR callback route)
- Setelah auth: upsert ke `public.profiles` via trigger atau di callback

```ts
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

## 17. PAYMENT GATEWAY (Phase 8 — pilih satu, lihat §12.14)

**Opsi A — Stripe:**
- Buat PaymentIntent di server action saat user klik "Place Order" di checkout
- Simpan `payment_intent_id` ke `orders`
- Webhook `/api/webhooks/payment/route.ts` listen `payment_intent.succeeded` → update `orders.payment_status = 'paid'`
- **Verifikasi signature webhook WAJIB** (`stripe.webhooks.constructEvent`) — jangan trust payload tanpa verifikasi

**Opsi B — Midtrans:**
- Buat Snap token di server action, simpan `snap_token` ke `orders`
- Webhook (notification handler) verifikasi signature key sebelum update `payment_status`

> Agent tidak boleh memilih sendiri Stripe vs Midtrans — ini keputusan user (lihat AGENTS.md §13 validasi pre-flight). Default rekomendasi jika user tidak comply spesifik: Stripe (dokumentasi & SDK Next.js lebih matang).

---

*File ini adalah source of truth untuk semua keputusan visual, struktur konten, dan data. Setiap komponen harus merujuk ke sini sebelum diimplementasikan. Jika sesuatu tidak tercakup di sini, AGENTS.md mewajibkan agent untuk berhenti dan bertanya ke user — bukan menebak.*a