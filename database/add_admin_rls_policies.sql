-- RLS Audit: Add missing admin policies for tables that currently lack them

-- Orders: admin can read all
create policy "orders: admin read all"
  on public.orders for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Order items: admin can read all
create policy "order_items: admin read all"
  on public.order_items for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Order items: admin can update (for moderation)
create policy "order_items: admin update"
  on public.order_items for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Products: admin can read all (including drafts/inactive)
create policy "products: admin read all"
  on public.products for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Products: admin can update
create policy "products: admin update"
  on public.products for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Currencies: admin can update
create policy "currencies: admin update"
  on public.currencies for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Vendors: admin can read all (including unverified)
create policy "vendors: admin read all"
  on public.vendors for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Vendors: admin can update (approve/reject)
create policy "vendors: admin update"
  on public.vendors for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Profiles: admin can read all profiles
create policy "profiles: admin read all"
  on public.profiles for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
