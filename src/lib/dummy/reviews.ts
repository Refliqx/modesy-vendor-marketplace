export interface DummyReview {
  id: number
  productSlug: string
  reviewerName: string
  reviewerAvatarSeed: string
  rating: number
  comment: string
  createdAgo: string
}

export const dummyReviews: DummyReview[] = [
  { id: 1, productSlug: 'denim-jacket-classic', reviewerName: 'Sarah M.', reviewerAvatarSeed: 'sarah', rating: 5, comment: 'Love this jacket! The fit is perfect and the quality is outstanding. Highly recommend!', createdAgo: '2 weeks ago' },
  { id: 2, productSlug: 'denim-jacket-classic', reviewerName: 'James K.', reviewerAvatarSeed: 'james', rating: 4, comment: 'Great jacket for the price. Runs slightly large but that is the style.', createdAgo: '1 month ago' },
  { id: 3, productSlug: 'denim-jacket-classic', reviewerName: 'Elena R.', reviewerAvatarSeed: 'elena', rating: 5, comment: 'Perfect layering piece. Already received so many compliments!', createdAgo: '3 months ago' },
  { id: 4, productSlug: 'leather-sneakers-white', reviewerName: 'Mike T.', reviewerAvatarSeed: 'mike', rating: 4, comment: 'Very comfortable sneakers. White looks great but needs regular cleaning.', createdAgo: '1 week ago' },
  { id: 5, productSlug: 'leather-sneakers-white', reviewerName: 'Anna L.', reviewerAvatarSeed: 'anna', rating: 5, comment: 'Best sneakers I have ever owned. So stylish and comfy!', createdAgo: '2 months ago' },
  { id: 6, productSlug: 'gold-plated-necklace', reviewerName: 'Priya S.', reviewerAvatarSeed: 'priya', rating: 5, comment: 'Stunning necklace! Looks way more expensive than it actually is.', createdAgo: '1 week ago' },
  { id: 7, productSlug: 'gold-plated-necklace', reviewerName: 'Olivia W.', reviewerAvatarSeed: 'olivia', rating: 4, comment: 'Beautiful design. The clasp could be a bit sturdier but overall great.', createdAgo: '3 weeks ago' },
  { id: 8, productSlug: 'gold-plated-necklace', reviewerName: 'Fatima A.', reviewerAvatarSeed: 'fatima', rating: 5, comment: 'Perfect gift! My daughter loved it.', createdAgo: '2 months ago' },
  { id: 9, productSlug: 'oversized-knit-sweater', reviewerName: 'Claire D.', reviewerAvatarSeed: 'claire', rating: 4, comment: 'Super cozy and warm. Color is exactly as pictured.', createdAgo: '2 weeks ago' },
  { id: 10, productSlug: 'oversized-knit-sweater', reviewerName: 'Tom H.', reviewerAvatarSeed: 'tom', rating: 3, comment: 'Nice sweater but pills after a few washes. Hand wash recommended.', createdAgo: '1 month ago' },
  { id: 11, productSlug: 'ceramic-vase-set', reviewerName: 'Emma J.', reviewerAvatarSeed: 'emma', rating: 5, comment: 'Beautiful vases! Each one is unique. Perfect for my living room.', createdAgo: '3 days ago' },
  { id: 12, productSlug: 'ceramic-vase-set', reviewerName: 'David P.', reviewerAvatarSeed: 'david', rating: 4, comment: 'Nice quality ceramics. Colors are subtle and elegant.', createdAgo: '2 weeks ago' },
  { id: 13, productSlug: 'silver-hoop-earrings', reviewerName: 'Nina G.', reviewerAvatarSeed: 'nina', rating: 5, comment: 'My go-to earrings! Lightweight and go with everything.', createdAgo: '1 week ago' },
  { id: 14, productSlug: 'silver-hoop-earrings', reviewerName: 'Rachel B.', reviewerAvatarSeed: 'rachel', rating: 4, comment: 'Classic hoops at a great price. No tarnishing so far.', createdAgo: '1 month ago' },
  { id: 15, productSlug: 'tailored-blazer-black', reviewerName: 'Marcus J.', reviewerAvatarSeed: 'marcus', rating: 5, comment: 'Incredible blazer. The fit is phenomenal and fabric feels premium.', createdAgo: '2 weeks ago' },
  { id: 16, productSlug: 'tailored-blazer-black', reviewerName: 'Sophie L.', reviewerAvatarSeed: 'sophie', rating: 5, comment: 'Perfect for the office. Looks custom-tailored.', createdAgo: '3 months ago' },
  { id: 17, productSlug: 'running-shoes-pro', reviewerName: 'Alex R.', reviewerAvatarSeed: 'alex', rating: 4, comment: 'Great running shoes! Very responsive cushioning.', createdAgo: '1 week ago' },
  { id: 18, productSlug: 'running-shoes-pro', reviewerName: 'Carlos M.', reviewerAvatarSeed: 'carlos', rating: 5, comment: 'Best running shoes I have ever used. Worth every penny!', createdAgo: '1 month ago' },
  { id: 19, productSlug: 'wireless-earbuds-v2', reviewerName: 'Jenny K.', reviewerAvatarSeed: 'jenny', rating: 4, comment: 'Great sound quality and battery life. Noise cancellation is decent.', createdAgo: '3 days ago' },
  { id: 20, productSlug: 'wireless-earbuds-v2', reviewerName: 'Sam W.', reviewerAvatarSeed: 'sam', rating: 5, comment: 'Amazing earbuds! The sound is crystal clear and they fit perfectly.', createdAgo: '2 weeks ago' },
  { id: 21, productSlug: 'photoshop-action-pack', reviewerName: 'Lisa C.', reviewerAvatarSeed: 'lisa', rating: 5, comment: 'These actions are a game changer! Saved me hours of editing.', createdAgo: '1 week ago' },
  { id: 22, productSlug: 'photoshop-action-pack', reviewerName: 'Ryan T.', reviewerAvatarSeed: 'ryan', rating: 5, comment: 'Incredible value. Every action works beautifully.', createdAgo: '1 month ago' },
  { id: 23, productSlug: 'minimalist-desk-lamp', reviewerName: 'Hannah B.', reviewerAvatarSeed: 'hannah', rating: 4, comment: 'Sleek design and great lighting. The dimmer is very useful.', createdAgo: '2 weeks ago' },
  { id: 24, productSlug: 'minimalist-desk-lamp', reviewerName: 'Kevin L.', reviewerAvatarSeed: 'kevin', rating: 5, comment: 'Perfect desk lamp. Minimalist and functional.', createdAgo: '2 months ago' },
  { id: 25, productSlug: 'pearl-drop-earrings', reviewerName: 'Grace H.', reviewerAvatarSeed: 'grace', rating: 5, comment: 'Absolutely gorgeous pearls. Wore them to a wedding and got so many compliments!', createdAgo: '1 month ago' },
  { id: 26, productSlug: 'linen-shirt-summer', reviewerName: 'Daniel F.', reviewerAvatarSeed: 'daniel', rating: 4, comment: 'Breathable and lightweight. Perfect for hot summer days.', createdAgo: '2 weeks ago' },
  { id: 27, productSlug: 'canvas-slip-on', reviewerName: 'Mia S.', reviewerAvatarSeed: 'mia', rating: 4, comment: 'Comfy and casual. True to size. Love the easy slip-on design.', createdAgo: '1 week ago' },
  { id: 28, productSlug: 'minimal-chain-bracelet', reviewerName: 'Aisha K.', reviewerAvatarSeed: 'aisha', rating: 5, comment: 'Love this bracelet! So minimalist and elegant. Never take it off.', createdAgo: '3 weeks ago' },
  { id: 29, productSlug: 'plush-teddy-bear', reviewerName: 'Noah P.', reviewerAvatarSeed: 'noah', rating: 5, comment: 'My daughter absolutely loves this teddy bear. So soft and well-made.', createdAgo: '1 week ago' },
  { id: 30, productSlug: 'lightroom-presets-vol3', reviewerName: 'Zoe M.', reviewerAvatarSeed: 'zoe', rating: 5, comment: 'Best presets I have ever bought! The moody pack is incredible.', createdAgo: '2 days ago' },
]
