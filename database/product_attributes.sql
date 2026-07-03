-- Product Attributes: color, size, material for filtering
-- Run in Supabase SQL Editor

-- 1. Add attribute columns to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color varchar(50);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size varchar(50);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS material varchar(100);

-- 2. Create lookup tables
CREATE TABLE IF NOT EXISTS public.product_colors (
  id bigint primary key generated always as identity,
  name varchar(50) not null,
  hex_code varchar(7),
  status boolean default true,
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS public.product_sizes (
  id bigint primary key generated always as identity,
  name varchar(50) not null,
  status boolean default true,
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS public.product_materials (
  id bigint primary key generated always as identity,
  name varchar(50) not null,
  status boolean default true,
  created_at timestamptz default now()
);

-- 3. RLS
ALTER TABLE public.product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_colors: public read"
  ON public.product_colors FOR SELECT USING (status = true);

CREATE POLICY "product_sizes: public read"
  ON public.product_sizes FOR SELECT USING (status = true);

CREATE POLICY "product_materials: public read"
  ON public.product_materials FOR SELECT USING (status = true);

CREATE POLICY "product_colors: admin manage"
  ON public.product_colors FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "product_sizes: admin manage"
  ON public.product_sizes FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "product_materials: admin manage"
  ON public.product_materials FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 4. Seed data
INSERT INTO public.product_colors (name, hex_code) VALUES
  ('Black', '#000000'),
  ('White', '#FFFFFF'),
  ('Red', '#FF0000'),
  ('Blue', '#0000FF'),
  ('Green', '#008000'),
  ('Yellow', '#FFFF00'),
  ('Purple', '#800080'),
  ('Pink', '#FFC0CB'),
  ('Gray', '#808080'),
  ('Brown', '#A52A2A'),
  ('Navy', '#000080'),
  ('Beige', '#F5F5DC')
ON CONFLICT DO NOTHING;

INSERT INTO public.product_sizes (name) VALUES
  ('XS'), ('S'), ('M'), ('L'), ('XL'), ('XXL'),
  ('One Size'), ('36'), ('37'), ('38'), ('39'), ('40'), ('41'), ('42'), ('43'), ('44')
ON CONFLICT DO NOTHING;

INSERT INTO public.product_materials (name) VALUES
  ('Cotton'), ('Linen'), ('Denim'), ('Leather'), ('Polyester'),
  ('Wool'), ('Silk'), ('Canvas'), ('Nylon'), ('Spandex'),
  ('Rayon'), ('Velvet'), ('Cashmere'), ('Lace'), ('Satin')
ON CONFLICT DO NOTHING;

-- 5. Update existing products with random attributes
UPDATE public.products
SET color = (ARRAY['Black', 'White', 'Red', 'Blue', 'Green', 'Navy', 'Gray', 'Brown', 'Beige', 'Pink'])[floor(random() * 10 + 1)],
    size = (ARRAY['S', 'M', 'L', 'XL', 'One Size'])[floor(random() * 5 + 1)],
    material = (ARRAY['Cotton', 'Linen', 'Denim', 'Leather', 'Polyester', 'Wool', 'Silk', 'Canvas'])[floor(random() * 8 + 1)]
WHERE color IS NULL;
