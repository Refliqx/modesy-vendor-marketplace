-- Migration: Add missing INSERT policies for orders & order_items
-- The RLS on these tables only had SELECT policies, blocking checkout payment flow.

-- Allow authenticated users to insert their own orders
create policy "Users can insert own orders"
  on public.orders for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Allow authenticated users to insert order items that belong to their orders
-- (the order must exist first and belong to the current user)
create policy "Buyers can insert own order items"
  on public.order_items for insert
  to authenticated
  with check (
    exists (
      select 1 from public.orders
      where id = order_items.order_id
      and user_id = auth.uid()
    )
  );
