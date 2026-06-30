-- SQL script to be executed in the Supabase SQL Editor.
-- This script creates a SECURITY DEFINER function to update the currencies' exchange rates,
-- allowing authenticated or anonymous users to trigger updates via Server Actions
-- without violating RLS policies.

CREATE OR REPLACE FUNCTION public.update_currency_rates(rates jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT * FROM jsonb_each_text(rates) LOOP
    UPDATE public.currencies
    SET exchange_rate = r.value::numeric,
        updated_at = NOW()
    WHERE code = r.key;
  END LOOP;
END;
$$;

-- Grant execution permission to anonymous and authenticated roles
GRANT EXECUTE ON FUNCTION public.update_currency_rates(jsonb) TO anon;
GRANT EXECUTE ON FUNCTION public.update_currency_rates(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_currency_rates(jsonb) TO service_role;
