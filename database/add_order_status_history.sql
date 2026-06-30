-- Migration: order_status_history
-- Tracking every status transition on order_items.order_status

create table public.order_status_history (
  id            int4          primary key generated always as identity,
  order_item_id int4          not null references public.order_items(id) on delete cascade,
  from_status   varchar(50),   -- null on first insert (initial 'pending' status)
  to_status     varchar(50)   not null,
  changed_by    uuid          references auth.users(id) on delete set null,
  note          text,          -- optional (e.g. "tracking number set")
  created_at    timestamptz   default now()
);

alter table public.order_status_history enable row level security;

-- RLS policies
create policy "order_status_history: buyer can read own"
  on public.order_status_history for select
  using (
    exists (
      select 1 from public.order_items oi
      join public.orders o on o.id = oi.order_id
      where oi.id = order_status_history.order_item_id
      and o.user_id = auth.uid()
    )
  );

create policy "order_status_history: vendor can read own items"
  on public.order_status_history for select
  using (
    exists (
      select 1 from public.order_items oi
      join public.vendors v on v.id = oi.vendor_id
      where oi.id = order_status_history.order_item_id
      and v.user_id = auth.uid()
    )
  );

create policy "order_status_history: admin can read all"
  on public.order_status_history for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Insert policy: vendors/admin can insert via server action
create policy "order_status_history: vendor/admin can insert"
  on public.order_status_history for insert
  with check (true);  -- server-side auth check in the action
