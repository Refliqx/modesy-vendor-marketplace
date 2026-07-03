-- RLS Audit Fix: Missing policies that block functionality
-- Run this AFTER phase9_missing_tables.sql

-- ============================================================
-- 1. brands: missing public read (blocks brand filtering on product pages)
-- ============================================================
create policy "brands: public read"
  on public.brands for select
  using (status = true);

create policy "brands: admin manage all"
  on public.brands for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- 2. product_images: missing vendor write (blocks product image upload in saveProductAction)
-- ============================================================
create policy "product_images: vendor manage own"
  on public.product_images for insert
  with check (
    exists (
      select 1 from public.products
      join public.vendors on vendors.id = products.vendor_id
      where products.id = product_images.product_id
      and vendors.user_id = auth.uid()
    )
  );

create policy "product_images: vendor update own"
  on public.product_images for update
  using (
    exists (
      select 1 from public.products
      join public.vendors on vendors.id = products.vendor_id
      where products.id = product_images.product_id
      and vendors.user_id = auth.uid()
    )
  );

create policy "product_images: vendor delete own"
  on public.product_images for delete
  using (
    exists (
      select 1 from public.products
      join public.vendors on vendors.id = products.vendor_id
      where products.id = product_images.product_id
      and vendors.user_id = auth.uid()
    )
  );

-- Admin manage all
create policy "product_images: admin manage all"
  on public.product_images for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- 3. product_options: missing vendor write (blocks variation management)
-- ============================================================
create policy "product_options: vendor manage own"
  on public.product_options for insert
  with check (
    exists (
      select 1 from public.products
      join public.vendors on vendors.id = products.vendor_id
      where products.id = product_options.product_id
      and vendors.user_id = auth.uid()
    )
  );

create policy "product_options: vendor update own"
  on public.product_options for update
  using (
    exists (
      select 1 from public.products
      join public.vendors on vendors.id = products.vendor_id
      where products.id = product_options.product_id
      and vendors.user_id = auth.uid()
    )
  );

create policy "product_options: vendor delete own"
  on public.product_options for delete
  using (
    exists (
      select 1 from public.products
      join public.vendors on vendors.id = products.vendor_id
      where products.id = product_options.product_id
      and vendors.user_id = auth.uid()
    )
  );

create policy "product_options: admin manage all"
  on public.product_options for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- 4. product_option_values: missing vendor write (blocks variation value management)
-- ============================================================
create policy "product_option_values: vendor manage own"
  on public.product_option_values for insert
  with check (
    exists (
      select 1 from public.product_options
      join public.products on products.id = product_options.product_id
      join public.vendors on vendors.id = products.vendor_id
      where product_options.id = product_option_values.option_id
      and vendors.user_id = auth.uid()
    )
  );

create policy "product_option_values: vendor update own"
  on public.product_option_values for update
  using (
    exists (
      select 1 from public.product_options
      join public.products on products.id = product_options.product_id
      join public.vendors on vendors.id = products.vendor_id
      where product_options.id = product_option_values.option_id
      and vendors.user_id = auth.uid()
    )
  );

create policy "product_option_values: vendor delete own"
  on public.product_option_values for delete
  using (
    exists (
      select 1 from public.product_options
      join public.products on products.id = product_options.product_id
      join public.vendors on vendors.id = products.vendor_id
      where product_options.id = product_option_values.option_id
      and vendors.user_id = auth.uid()
    )
  );

create policy "product_option_values: admin manage all"
  on public.product_option_values for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- 5. product_reviews: add update/delete for own reviews
-- ============================================================
create policy "product_reviews: update own"
  on public.product_reviews for update
  using (auth.uid() = user_id);

create policy "product_reviews: delete own"
  on public.product_reviews for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 6. languages: admin manage (for completeness)
-- ============================================================
create policy "languages: admin manage all"
  on public.languages for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
