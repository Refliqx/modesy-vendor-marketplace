-- ============================================================
-- Performance Indexes for Modesy Marketplace
-- Run this in Supabase SQL Editor
-- Estimated impact: 10-100x faster on read queries at scale
-- ============================================================

-- 1. CART — user lookups + checkout join
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items (user_id);

-- 2. WISHLIST — user lookups
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists (user_id);

-- 3. PRODUCTS — homepage listing queries (the most frequent)
CREATE INDEX IF NOT EXISTS idx_products_active_listing ON public.products (status, is_draft, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_special_offers ON public.products (status, is_draft, discount_percent) WHERE discount_percent IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products (status, is_draft, is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON public.products (vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products (category_id);

-- 4. PRODUCT IMAGES — PDP main image lookup
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images (product_id, is_main, row_order);

-- 5. PRODUCT OPTIONS / VALUES — PDP variation selector
CREATE INDEX IF NOT EXISTS idx_product_options_product_id ON public.product_options (product_id);
CREATE INDEX IF NOT EXISTS idx_product_option_values_option_id ON public.product_option_values (option_id);

-- 6. PRODUCT REVIEWS — PDP review list + rating aggregate
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews (product_id, created_at DESC);

-- 7. ORDERS — user order history
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders (payment_status, created_at DESC);

-- 8. ORDER ITEMS — vendor dashboard + review eligibility check
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_vendor_id ON public.order_items (vendor_id, order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_product_user ON public.order_items (product_id);

-- 9. VENDORS — user→vendor lookup (used in RLS policies)
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON public.vendors (user_id);

-- 10. TRANSLATIONS — language filtering joins (complements existing UNIQUE indexes)
CREATE INDEX IF NOT EXISTS idx_product_translations_language_id ON public.product_translations (language_id);
CREATE INDEX IF NOT EXISTS idx_category_translations_language_id ON public.category_translations (language_id);

-- 11. FULL-TEXT SEARCH (for the /search page)
-- Requires a tsvector column; run this migration separately:
--   ALTER TABLE public.product_translations ADD COLUMN search_vector tsvector
--     GENERATED ALWAYS AS (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(short_description, ''))) STORED;
--   CREATE INDEX idx_product_translations_search ON public.product_translations USING GIN (search_vector);
-- Then query: SELECT ... WHERE search_vector @@ plainto_tsquery('simple', $query);

-- 12. ANALYZE (update table statistics for query planner)
ANALYZE public.products;
ANALYZE public.product_translations;
ANALYZE public.product_images;
ANALYZE public.cart_items;
ANALYZE public.wishlists;
ANALYZE public.orders;
ANALYZE public.order_items;
ANALYZE public.product_reviews;
