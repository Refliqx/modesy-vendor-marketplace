export interface DummyBlogPost {
  id: number
  slug: string
  category: string
  title: string
  excerpt: string
  body: string
  publishedAgo: string
  coverImageSeed: string
}

export const dummyBlogPosts: DummyBlogPost[] = [
  {
    id: 1, slug: 'summer-fashion-trends-2025', category: 'Fashion',
    title: 'Top Summer Fashion Trends for 2025',
    excerpt: 'Discover the hottest summer trends that will dominate the fashion scene this year.',
    body: 'Summer is here and with it comes a fresh wave of fashion trends that promise to transform your wardrobe. From flowing linen pieces to bold statement accessories, this season is all about self-expression through style.\n\n## The Rise of Linen\n\nLinen has officially become the fabric of the season. Designers are embracing its natural texture and breathability, creating pieces that are both stylish and comfortable. Look for oversized linen shirts, wide-leg linen trousers, and relaxed linen dresses.\n\n## Statement Accessories\n\nThis summer, bigger is better when it comes to accessories. Chunky gold chains, oversized sunglasses, and wide-brimmed hats are must-haves. These pieces can transform even the simplest outfit into a fashion statement.\n\n## Sustainable Fashion\n\nSustainability continues to shape the fashion industry. More brands are adopting eco-friendly practices and using recycled materials. Shopping for quality pieces that last is not just a trend but a movement.\n\n## Color Palette\n\nThe summer color palette features warm earth tones, vibrant citrus shades, and classic whites. Terracotta, olive green, and sunny yellow are particularly popular this season.\n\nEmbrace these trends and make this summer your most stylish one yet!',
    publishedAgo: '2 weeks ago',
    coverImageSeed: 'blog-summer-fashion',
  },
  {
    id: 2, slug: 'diy-home-decor-ideas', category: 'Home & Living',
    title: '10 DIY Home Decor Ideas on a Budget',
    excerpt: 'Transform your living space with these affordable and creative DIY home decor projects.',
    body: 'You do not need to spend a fortune to make your home look beautiful. With a little creativity and some basic supplies, you can create stunning decor pieces that reflect your personal style.\n\n## 1. Gallery Wall\n\nCreate a gallery wall with a mix of framed prints, photos, and mirrors. Mix different frame styles and sizes for an eclectic look. Thrift stores are great sources for inexpensive frames.\n\n## 2. Painted Plant Pots\n\nGive your indoor plants a stylish home with hand-painted pots. Use geometric patterns, abstract designs, or simple color blocks for a modern look.\n\n## 3. Macrame Wall Hanging\n\nMacrame is back in style and surprisingly easy to learn. A simple wall hanging can add texture and warmth to any room.\n\n## 4. Upcycled Furniture\n\nGive old furniture a new life with a coat of paint and new hardware. A fresh color can completely transform a tired piece.\n\n## 5. Candle Holders\n\nCreate unique candle holders from recycled glass jars. Add sand, stones, or dried flowers for a natural touch.\n\nThese projects are perfect for weekends and will give your home a personal touch that money cannot buy.',
    publishedAgo: '1 month ago',
    coverImageSeed: 'blog-home-decor',
  },
  {
    id: 3, slug: 'jewelry-care-guide', category: 'Jewelry',
    title: 'Complete Guide to Jewelry Care and Maintenance',
    excerpt: 'Learn how to keep your precious jewelry pieces looking beautiful for years to come.',
    body: 'Proper jewelry care is essential to maintain the beauty and longevity of your pieces. Whether you own fine jewelry or fashion pieces, these tips will help keep them looking their best.\n\n## Storage Matters\n\nStore each piece of jewelry separately to prevent scratching. Use a jewelry box with individual compartments or soft pouches. Keep silver jewelry in anti-tarnish cloths or bags.\n\n## Cleaning Different Materials\n\n- **Gold**: Soak in warm water with mild dish soap, gently brush with a soft toothbrush, and pat dry.\n- **Silver**: Use a specialized silver polishing cloth. Avoid harsh chemical cleaners.\n- **Pearls**: Wipe with a soft, damp cloth after each wear. Never submerge pearl necklaces.\n- **Gemstones**: Clean with a soft cloth. Some stones are porous and should not be soaked.\n\n## What to Avoid\n\n- Remove jewelry before swimming, showering, or exercising.\n- Avoid exposure to perfume, hairspray, and lotions.\n- Keep jewelry away from extreme temperatures.\n\n## Professional Maintenance\n\nHave your jewelry professionally cleaned and inspected once a year. They can check for loose stones, worn prongs, and other issues.\n\nWith proper care, your jewelry can last a lifetime and become treasured heirlooms.',
    publishedAgo: '2 months ago',
    coverImageSeed: 'blog-jewelry-care',
  },
  {
    id: 4, slug: 'digital-nomad-essentials', category: 'Technology',
    title: 'Essential Tech Gadgets for Digital Nomads',
    excerpt: 'The must-have tech accessories that every digital nomad needs for productive remote work.',
    body: 'Being a digital nomad requires the right tools to stay productive while on the move. Here are our top picks for essential tech gadgets.\n\n## Wireless Earbuds\n\nA quality pair of wireless earbuds with noise cancellation is non-negotiable. They help you focus in noisy coffee shops and take calls crystal clear.\n\n## Portable Power Bank\n\nNever run out of battery with a high-capacity power bank. Look for one with fast charging and multiple ports.\n\n## Laptop Stand\n\nA portable laptop stand improves ergonomics and keeps your device cool during long work sessions.\n\n## Universal Adapter\n\nTraveling internationally requires a universal power adapter with multiple plug types and USB ports.\n\n## External Hard Drive\n\nBack up your work regularly with a portable SSD that is fast and durable.\n\nInvesting in quality tech makes remote work smoother and more enjoyable.',
    publishedAgo: '3 months ago',
    coverImageSeed: 'blog-digital-nomad',
  },
  {
    id: 5, slug: 'sustainable-shopping-guide', category: 'Lifestyle',
    title: 'The Ultimate Guide to Sustainable Online Shopping',
    excerpt: 'How to make environmentally conscious choices while shopping online.',
    body: 'Sustainable shopping is about making mindful choices that reduce your environmental impact. Here is how you can shop more sustainably.\n\n## Buy Quality Over Quantity\n\nInvest in well-made pieces that will last for years. Fast fashion may be cheap, but it comes at an environmental cost.\n\n## Look for Sustainable Materials\n\nChoose products made from organic cotton, linen, hemp, bamboo, or recycled materials. These fabrics have a lower environmental footprint.\n\n## Support Ethical Brands\n\nResearch brands that prioritize fair labor practices and environmental sustainability. Many brands now share their sustainability practices openly.\n\n## Care for Your Items\n\nExtend the life of your purchases by following care instructions. Proper maintenance means fewer replacements.\n\n## Second-Hand Shopping\n\nConsider buying pre-owned items. Vintage and thrifted pieces are unique and environmentally friendly.\n\nSmall changes in our shopping habits can make a big difference for the planet.',
    publishedAgo: '3 months ago',
    coverImageSeed: 'blog-sustainable',
  },
  {
    id: 6, slug: 'photography-tips-beginners', category: 'Photography',
    title: '10 Photography Tips for Beginners',
    excerpt: 'Start your photography journey with these essential tips and techniques.',
    body: 'Great photography is about understanding light, composition, and your subject. Here are tips to help you take better photos.\n\n## Understand Lighting\n\nNatural light is your best friend. The golden hour (just after sunrise or before sunset) provides beautiful, warm light.\n\n## Rule of Thirds\n\nDivide your frame into a 3x3 grid and place your subject at the intersections. This creates more dynamic compositions.\n\n## Focus on the Subject\n\nMake sure your subject is sharp and in focus. Use a shallow depth of field to blur backgrounds and make your subject stand out.\n\n## Experiment with Angles\n\nDo not shoot everything at eye level. Try low angles, high angles, and unusual perspectives.\n\n## Edit Thoughtfully\n\nLess is more when editing. Adjust exposure, contrast, and color balance subtly for natural-looking results.\n\nPractice regularly and you will see improvement in no time.',
    publishedAgo: '4 months ago',
    coverImageSeed: 'blog-photography',
  },
]
