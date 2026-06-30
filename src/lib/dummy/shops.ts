export interface DummyShop {
  slug: string
  name: string
  avatarSeed: string
  coverSeed: string
  rating: number
  reviewCount: number
  productCount: number
  joinedYear: number
  phone: string
  email: string
  description: string
}

export const dummyShops: DummyShop[] = [
  {
    slug: 'trendshop',
    name: 'Trendshop',
    avatarSeed: 'trendshop-avatar',
    coverSeed: 'trendshop-cover',
    rating: 4.6,
    reviewCount: 24,
    productCount: 48,
    joinedYear: 2024,
    phone: '+1 (555) 123-4567',
    email: 'hello@trendshop.com',
    description: 'Trendshop is your destination for curated fashion, accessories, and home decor. We source products from around the world to bring you the latest trends at affordable prices.',
  },
  {
    slug: 'vintagestyle',
    name: 'VintageStyle',
    avatarSeed: 'vintage-avatar',
    coverSeed: 'vintage-cover',
    rating: 4.8,
    reviewCount: 36,
    productCount: 72,
    joinedYear: 2023,
    phone: '+1 (555) 987-6543',
    email: 'hello@vintagestyle.com',
    description: 'Specializing in vintage-inspired fashion and retro accessories. Every piece tells a story.',
  },
  {
    slug: 'techhaven',
    name: 'TechHaven',
    avatarSeed: 'tech-avatar',
    coverSeed: 'tech-cover',
    rating: 4.3,
    reviewCount: 51,
    productCount: 120,
    joinedYear: 2024,
    phone: '+1 (555) 456-7890',
    email: 'support@techhaven.com',
    description: 'Your one-stop shop for the latest gadgets, electronics, and digital products.',
  },
]
