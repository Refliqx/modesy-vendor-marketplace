


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."product_type" AS ENUM (
    'physical',
    'digital',
    'license'
);


ALTER TYPE "public"."product_type" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'admin',
    'vendor',
    'customer'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, avatar_url, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User Baru'),
    'customer'::public.user_role,
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'phone_number'
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_payment_success"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_item RECORD;
BEGIN
    IF NEW.payment_status = 'paid' AND OLD.payment_status <> 'paid' THEN
        
        FOR v_item IN 
            SELECT vendor_id, vendor_earning 
            FROM public.order_items 
            WHERE order_id = NEW.id
        LOOP
            UPDATE public.vendors 
            SET balance = balance + v_item.vendor_earning
            WHERE id = v_item.vendor_id;
        END LOOP;
        
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_payment_success"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."process_checkout"("p_shipping_address" "text", "p_payment_method" character varying) RETURNS character varying
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_user_id UUID;
    v_order_number VARCHAR(50);
    v_order_id INT;
    v_total_price DECIMAL(15, 4) := 0;
    v_total_shipping DECIMAL(15, 4) := 0;
    v_cart_record RECORD;
    v_commission_rate DECIMAL(5,2) := 5.00;
    v_current_commission DECIMAL(15, 4);
    v_vendor_earning DECIMAL(15, 4);
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User tidak terotentikasi.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.cart_items WHERE user_id = v_user_id) THEN
        RAISE EXCEPTION 'Keranjang belanja kosong.';
    END IF;

    v_order_number := 'ORD-' || to_char(NOW(), 'YYYYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 6));

    SELECT SUM(p.price * c.quantity) INTO v_total_price
    FROM public.cart_items c
    JOIN public.products p ON c.product_id = p.id
    WHERE c.user_id = v_user_id;

    SELECT COUNT(*) * 10000 INTO v_total_shipping 
    FROM public.cart_items 
    WHERE user_id = v_user_id;

    INSERT INTO public.orders (user_id, order_number, total_price, total_shipping_cost, payment_status, payment_method, shipping_address)
    VALUES (v_user_id, v_order_number, (v_total_price + v_total_shipping), v_total_shipping, 'pending', p_payment_method, p_shipping_address)
    RETURNING id INTO v_order_id;

    FOR v_cart_record IN 
        SELECT c.product_id, c.quantity, p.price, p.vendor_id, v.custom_commission_rate 
        FROM public.cart_items c
        JOIN public.products p ON c.product_id = p.id
        JOIN public.vendors v ON p.vendor_id = v.id
        WHERE c.user_id = v_user_id
    LOOP
        IF v_cart_record.custom_commission_rate IS NOT NULL THEN
            v_commission_rate := v_cart_record.custom_commission_rate;
        END IF;

        v_current_commission := (v_cart_record.price * v_cart_record.quantity) * (v_commission_rate / 100);
        v_vendor_earning := (v_cart_record.price * v_cart_record.quantity) - v_current_commission;

        INSERT INTO public.order_items (order_id, vendor_id, product_id, price, quantity, shipping_cost, commission_amount, vendor_earning, order_status)
        VALUES (v_order_id, v_cart_record.vendor_id, v_cart_record.product_id, v_cart_record.price, v_cart_record.quantity, 10000.0000, v_current_commission, v_vendor_earning, 'pending');

        UPDATE public.products 
        SET stock = stock - v_cart_record.quantity 
        WHERE id = v_cart_record.product_id;
    END LOOP;

    DELETE FROM public.cart_items WHERE user_id = v_user_id;

    RETURN v_order_number;
END;
$$;


ALTER FUNCTION "public"."process_checkout"("p_shipping_address" "text", "p_payment_method" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_modified_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_modified_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."brands" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "slug" character varying NOT NULL,
    "logo_path" character varying,
    "status" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."brands" OWNER TO "postgres";


ALTER TABLE "public"."brands" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."brands_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."cart_items" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "product_id" integer NOT NULL,
    "quantity" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "cart_items_quantity_check" CHECK (("quantity" > 0))
);


ALTER TABLE "public"."cart_items" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."cart_items_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."cart_items_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."cart_items_id_seq" OWNED BY "public"."cart_items"."id";



CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" integer NOT NULL,
    "slug" character varying(255) NOT NULL,
    "image_path" character varying(255) DEFAULT NULL::character varying,
    "status" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "parent_id" integer
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."categories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."categories_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."categories_id_seq" OWNED BY "public"."categories"."id";



CREATE TABLE IF NOT EXISTS "public"."category_translations" (
    "id" integer NOT NULL,
    "category_id" integer,
    "language_id" integer,
    "name" character varying(255) NOT NULL
);


ALTER TABLE "public"."category_translations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."category_translations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."category_translations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."category_translations_id_seq" OWNED BY "public"."category_translations"."id";



CREATE TABLE IF NOT EXISTS "public"."currencies" (
    "id" integer NOT NULL,
    "name" character varying(50) NOT NULL,
    "code" character varying(3) NOT NULL,
    "symbol" character varying(10) NOT NULL,
    "exchange_rate" numeric(15,6) NOT NULL,
    "is_default" boolean DEFAULT false,
    "status" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."currencies" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."currencies_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."currencies_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."currencies_id_seq" OWNED BY "public"."currencies"."id";



CREATE TABLE IF NOT EXISTS "public"."languages" (
    "id" integer NOT NULL,
    "name" character varying(50) NOT NULL,
    "code" character varying(5) NOT NULL,
    "text_direction" character varying(3) DEFAULT 'ltr'::character varying,
    "is_default" boolean DEFAULT false,
    "status" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."languages" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."languages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."languages_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."languages_id_seq" OWNED BY "public"."languages"."id";



CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" integer NOT NULL,
    "order_id" integer NOT NULL,
    "vendor_id" integer NOT NULL,
    "product_id" integer NOT NULL,
    "price" numeric(15,4) NOT NULL,
    "quantity" integer NOT NULL,
    "shipping_cost" numeric(15,4) DEFAULT 0.0000,
    "commission_amount" numeric(15,4) DEFAULT 0.0000,
    "vendor_earning" numeric(15,4) DEFAULT 0.0000,
    "order_status" character varying(50) DEFAULT 'pending'::character varying,
    "tracking_number" character varying(100) DEFAULT NULL::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."order_items_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."order_items_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."order_items_id_seq" OWNED BY "public"."order_items"."id";



CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" integer NOT NULL,
    "user_id" "uuid",
    "order_number" character varying(50) NOT NULL,
    "total_price" numeric(15,4) DEFAULT 0.0000 NOT NULL,
    "total_shipping_cost" numeric(15,4) DEFAULT 0.0000 NOT NULL,
    "payment_status" character varying(50) DEFAULT 'pending'::character varying,
    "payment_method" character varying(50),
    "shipping_address" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "payment_intent_id" character varying,
    "session_id" character varying,
    "snap_token" character varying
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."orders_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."orders_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."orders_id_seq" OWNED BY "public"."orders"."id";



CREATE TABLE IF NOT EXISTS "public"."product_images" (
    "id" integer NOT NULL,
    "product_id" integer NOT NULL,
    "image_url" "text" NOT NULL,
    "is_main" boolean DEFAULT false,
    "row_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."product_images" OWNER TO "postgres";


ALTER TABLE "public"."product_images" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."product_images_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."product_option_values" (
    "id" integer NOT NULL,
    "option_id" integer NOT NULL,
    "value" character varying NOT NULL,
    "price_modifier" numeric DEFAULT 0,
    "stock" integer DEFAULT 0
);


ALTER TABLE "public"."product_option_values" OWNER TO "postgres";


ALTER TABLE "public"."product_option_values" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."product_option_values_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."product_options" (
    "id" integer NOT NULL,
    "product_id" integer NOT NULL,
    "name" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."product_options" OWNER TO "postgres";


ALTER TABLE "public"."product_options" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."product_options_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."product_reviews" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "product_id" integer NOT NULL,
    "rating" integer NOT NULL,
    "review" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "product_reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."product_reviews" OWNER TO "postgres";


ALTER TABLE "public"."product_reviews" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."product_reviews_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."product_translations" (
    "id" integer NOT NULL,
    "product_id" integer,
    "language_id" integer,
    "title" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "short_description" character varying(500)
);


ALTER TABLE "public"."product_translations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."product_translations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."product_translations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."product_translations_id_seq" OWNED BY "public"."product_translations"."id";



CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" integer NOT NULL,
    "vendor_id" integer,
    "category_id" integer,
    "type" "public"."product_type" DEFAULT 'physical'::"public"."product_type" NOT NULL,
    "slug" character varying(255) NOT NULL,
    "price" numeric(15,4) DEFAULT 0.0000 NOT NULL,
    "stock" integer DEFAULT 0 NOT NULL,
    "weight" integer DEFAULT 0,
    "is_draft" boolean DEFAULT false,
    "status" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "discount_percent" numeric,
    "is_featured" boolean DEFAULT false,
    "brand_id" integer
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."products_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."products_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."products_id_seq" OWNED BY "public"."products"."id";



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" character varying(100) NOT NULL,
    "role" "public"."user_role" DEFAULT 'customer'::"public"."user_role",
    "avatar_url" "text",
    "phone_number" character varying(20),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vendors" (
    "id" integer NOT NULL,
    "user_id" "uuid",
    "shop_name" character varying(100) NOT NULL,
    "shop_slug" character varying(100) NOT NULL,
    "shop_logo" "text",
    "shop_description" "text",
    "balance" numeric(15,4) DEFAULT 0.0000,
    "custom_commission_rate" numeric(5,2) DEFAULT NULL::numeric,
    "is_verified" boolean DEFAULT false,
    "status" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."vendors" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."vendors_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."vendors_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."vendors_id_seq" OWNED BY "public"."vendors"."id";



CREATE TABLE IF NOT EXISTS "public"."wishlists" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "product_id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."wishlists" OWNER TO "postgres";


ALTER TABLE "public"."wishlists" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."wishlists_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."cart_items" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."cart_items_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."categories" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."categories_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."category_translations" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."category_translations_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."currencies" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."currencies_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."languages" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."languages_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."order_items" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."order_items_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."orders" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."orders_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."product_translations" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."product_translations_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."products" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."products_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."vendors" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."vendors_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."brands"
    ADD CONSTRAINT "brands_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."brands"
    ADD CONSTRAINT "brands_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."brands"
    ADD CONSTRAINT "brands_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."category_translations"
    ADD CONSTRAINT "category_translations_category_language_unique" UNIQUE ("category_id", "language_id");



ALTER TABLE ONLY "public"."category_translations"
    ADD CONSTRAINT "category_translations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."currencies"
    ADD CONSTRAINT "currencies_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."currencies"
    ADD CONSTRAINT "currencies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."languages"
    ADD CONSTRAINT "languages_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."languages"
    ADD CONSTRAINT "languages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_order_number_key" UNIQUE ("order_number");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_images"
    ADD CONSTRAINT "product_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_option_values"
    ADD CONSTRAINT "product_option_values_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_options"
    ADD CONSTRAINT "product_options_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_reviews"
    ADD CONSTRAINT "product_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_translations"
    ADD CONSTRAINT "product_translations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."category_translations"
    ADD CONSTRAINT "unique_category_lang" UNIQUE ("category_id", "language_id");



ALTER TABLE ONLY "public"."product_translations"
    ADD CONSTRAINT "unique_product_lang" UNIQUE ("product_id", "language_id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "unique_user_product_cart" UNIQUE ("user_id", "product_id");



ALTER TABLE ONLY "public"."vendors"
    ADD CONSTRAINT "vendors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vendors"
    ADD CONSTRAINT "vendors_shop_name_key" UNIQUE ("shop_name");



ALTER TABLE ONLY "public"."vendors"
    ADD CONSTRAINT "vendors_shop_slug_key" UNIQUE ("shop_slug");



ALTER TABLE ONLY "public"."vendors"
    ADD CONSTRAINT "vendors_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."wishlists"
    ADD CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wishlists"
    ADD CONSTRAINT "wishlists_user_id_product_id_key" UNIQUE ("user_id", "product_id");



CREATE OR REPLACE TRIGGER "on_order_paid" AFTER UPDATE ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."handle_payment_success"();



CREATE OR REPLACE TRIGGER "update_currencies_modtime" BEFORE UPDATE ON "public"."currencies" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



CREATE OR REPLACE TRIGGER "update_languages_modtime" BEFORE UPDATE ON "public"."languages" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



CREATE OR REPLACE TRIGGER "update_products_modtime" BEFORE UPDATE ON "public"."products" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



CREATE OR REPLACE TRIGGER "update_profiles_modtime" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



CREATE OR REPLACE TRIGGER "update_vendors_modtime" BEFORE UPDATE ON "public"."vendors" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."category_translations"
    ADD CONSTRAINT "category_translations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."category_translations"
    ADD CONSTRAINT "category_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."product_images"
    ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_option_values"
    ADD CONSTRAINT "product_option_values_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "public"."product_options"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_options"
    ADD CONSTRAINT "product_options_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_reviews"
    ADD CONSTRAINT "product_reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_reviews"
    ADD CONSTRAINT "product_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."product_translations"
    ADD CONSTRAINT "product_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_translations"
    ADD CONSTRAINT "product_translations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vendors"
    ADD CONSTRAINT "vendors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wishlists"
    ADD CONSTRAINT "wishlists_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wishlists"
    ADD CONSTRAINT "wishlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow admin to manage categories" ON "public"."categories" TO "authenticated" USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"public"."user_role"));



CREATE POLICY "Allow admin to manage category translations" ON "public"."category_translations" TO "authenticated" USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"public"."user_role"));



CREATE POLICY "Allow public read access to categories" ON "public"."categories" FOR SELECT USING (("status" = true));



CREATE POLICY "Allow public read access to category translations" ON "public"."category_translations" FOR SELECT USING (true);



CREATE POLICY "Allow public to read active product translations" ON "public"."product_translations" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."products" "p"
  WHERE (("p"."id" = "product_translations"."product_id") AND ("p"."status" = true) AND ("p"."is_draft" = false)))));



CREATE POLICY "Allow vendors to manage own product translations" ON "public"."product_translations" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."products" "p"
     JOIN "public"."vendors" "v" ON (("p"."vendor_id" = "v"."id")))
  WHERE (("p"."id" = "product_translations"."product_id") AND ("v"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."products" "p"
     JOIN "public"."vendors" "v" ON (("p"."vendor_id" = "v"."id")))
  WHERE (("p"."id" = "product_translations"."product_id") AND ("v"."user_id" = "auth"."uid"())))));



CREATE POLICY "Allow vendors to read own product translations" ON "public"."product_translations" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."products" "p"
     JOIN "public"."vendors" "v" ON (("p"."vendor_id" = "v"."id")))
  WHERE (("p"."id" = "product_translations"."product_id") AND ("v"."user_id" = "auth"."uid"())))));



CREATE POLICY "Buyers can view own order items" ON "public"."order_items" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."orders" "o"
  WHERE (("o"."id" = "order_items"."order_id") AND ("o"."user_id" = "auth"."uid"())))));



CREATE POLICY "Manage own cart" ON "public"."cart_items" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Public Read Categories" ON "public"."categories" FOR SELECT USING (("status" = true));



CREATE POLICY "Public Read Category Translations" ON "public"."category_translations" FOR SELECT USING (true);



CREATE POLICY "Public Read Currencies" ON "public"."currencies" FOR SELECT USING (("status" = true));



CREATE POLICY "Public Read Languages" ON "public"."languages" FOR SELECT USING (("status" = true));



CREATE POLICY "Public Read Product Translations" ON "public"."product_translations" FOR SELECT USING (true);



CREATE POLICY "Public Read Products" ON "public"."products" FOR SELECT USING ((("status" = true) AND ("is_draft" = false)));



CREATE POLICY "Public Read Vendor Info" ON "public"."vendors" FOR SELECT USING (("status" = true));



CREATE POLICY "User Read Own Profile" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "User Update Own Profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view own orders" ON "public"."orders" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Vendor Manage Own Products" ON "public"."products" TO "authenticated" USING (("vendor_id" IN ( SELECT "vendors"."id"
   FROM "public"."vendors"
  WHERE ("vendors"."user_id" = "auth"."uid"())))) WITH CHECK (("vendor_id" IN ( SELECT "vendors"."id"
   FROM "public"."vendors"
  WHERE ("vendors"."user_id" = "auth"."uid"()))));



CREATE POLICY "Vendor Manage Own Shop" ON "public"."vendors" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Vendors can manage own shop items" ON "public"."order_items" TO "authenticated" USING (("vendor_id" IN ( SELECT "vendors"."id"
   FROM "public"."vendors"
  WHERE ("vendors"."user_id" = "auth"."uid"())))) WITH CHECK (("vendor_id" IN ( SELECT "vendors"."id"
   FROM "public"."vendors"
  WHERE ("vendors"."user_id" = "auth"."uid"()))));



ALTER TABLE "public"."brands" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cart_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."category_translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."currencies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."languages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_images" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "product_images: public read" ON "public"."product_images" FOR SELECT USING (true);



ALTER TABLE "public"."product_option_values" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "product_option_values: public read" ON "public"."product_option_values" FOR SELECT USING (true);



ALTER TABLE "public"."product_options" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "product_options: public read" ON "public"."product_options" FOR SELECT USING (true);



ALTER TABLE "public"."product_reviews" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "product_reviews: insert own" ON "public"."product_reviews" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "product_reviews: public read" ON "public"."product_reviews" FOR SELECT USING (true);



ALTER TABLE "public"."product_translations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."vendors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wishlists" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "wishlists: all own" ON "public"."wishlists" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_payment_success"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_payment_success"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_payment_success"() TO "service_role";



GRANT ALL ON FUNCTION "public"."process_checkout"("p_shipping_address" "text", "p_payment_method" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."process_checkout"("p_shipping_address" "text", "p_payment_method" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."process_checkout"("p_shipping_address" "text", "p_payment_method" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."brands" TO "anon";
GRANT ALL ON TABLE "public"."brands" TO "authenticated";
GRANT ALL ON TABLE "public"."brands" TO "service_role";



GRANT ALL ON SEQUENCE "public"."brands_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."brands_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."brands_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."cart_items" TO "anon";
GRANT ALL ON TABLE "public"."cart_items" TO "authenticated";
GRANT ALL ON TABLE "public"."cart_items" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cart_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cart_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cart_items_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."category_translations" TO "anon";
GRANT ALL ON TABLE "public"."category_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."category_translations" TO "service_role";



GRANT ALL ON SEQUENCE "public"."category_translations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."category_translations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."category_translations_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."currencies" TO "anon";
GRANT ALL ON TABLE "public"."currencies" TO "authenticated";
GRANT ALL ON TABLE "public"."currencies" TO "service_role";



GRANT ALL ON SEQUENCE "public"."currencies_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."currencies_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."currencies_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."languages" TO "anon";
GRANT ALL ON TABLE "public"."languages" TO "authenticated";
GRANT ALL ON TABLE "public"."languages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."languages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."languages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."languages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON SEQUENCE "public"."order_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."order_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."order_items_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON SEQUENCE "public"."orders_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."orders_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."orders_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."product_images" TO "anon";
GRANT ALL ON TABLE "public"."product_images" TO "authenticated";
GRANT ALL ON TABLE "public"."product_images" TO "service_role";



GRANT ALL ON SEQUENCE "public"."product_images_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."product_images_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."product_images_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."product_option_values" TO "anon";
GRANT ALL ON TABLE "public"."product_option_values" TO "authenticated";
GRANT ALL ON TABLE "public"."product_option_values" TO "service_role";



GRANT ALL ON SEQUENCE "public"."product_option_values_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."product_option_values_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."product_option_values_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."product_options" TO "anon";
GRANT ALL ON TABLE "public"."product_options" TO "authenticated";
GRANT ALL ON TABLE "public"."product_options" TO "service_role";



GRANT ALL ON SEQUENCE "public"."product_options_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."product_options_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."product_options_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."product_reviews" TO "anon";
GRANT ALL ON TABLE "public"."product_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."product_reviews" TO "service_role";



GRANT ALL ON SEQUENCE "public"."product_reviews_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."product_reviews_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."product_reviews_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."product_translations" TO "anon";
GRANT ALL ON TABLE "public"."product_translations" TO "authenticated";
GRANT ALL ON TABLE "public"."product_translations" TO "service_role";



GRANT ALL ON SEQUENCE "public"."product_translations_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."product_translations_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."product_translations_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON SEQUENCE "public"."products_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."products_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."products_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."vendors" TO "anon";
GRANT ALL ON TABLE "public"."vendors" TO "authenticated";
GRANT ALL ON TABLE "public"."vendors" TO "service_role";



GRANT ALL ON SEQUENCE "public"."vendors_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."vendors_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."vendors_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."wishlists" TO "anon";
GRANT ALL ON TABLE "public"."wishlists" TO "authenticated";
GRANT ALL ON TABLE "public"."wishlists" TO "service_role";



GRANT ALL ON SEQUENCE "public"."wishlists_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."wishlists_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."wishlists_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































