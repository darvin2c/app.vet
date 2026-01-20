-- Migration: Standardize and Fix Triggers
-- Date: 2026-01-20
-- Description: 
-- 1. Creates ENUM 'movement_type' and adds 'type' column to product_movements.
-- 2. Standardizes trigger and function names (tf_* for functions, tr_* for triggers).
-- 3. Fixes logic for stock management (in/out support).
-- 4. Optimizes counter generation (BEFORE INSERT).
-- 5. Removes redundant triggers and functions.
-- 6. Applies audit triggers globally.

BEGIN;

-- 1. Structure Changes
DO $$ BEGIN
    CREATE TYPE public.movement_type AS ENUM ('in', 'out', 'adjustment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.product_movements 
ADD COLUMN IF NOT EXISTS "type" public.movement_type NOT NULL DEFAULT 'out';

-- 2. Drop Old Triggers and Functions
DROP TRIGGER IF EXISTS trg_movements_update_stock ON public.product_movements;
DROP TRIGGER IF EXISTS trg_products_initial_stock ON public.products;
DROP TRIGGER IF EXISTS set_orders_number ON public.orders;
DROP TRIGGER IF EXISTS trg_order_recalc_totals ON public.order_items;
DROP TRIGGER IF EXISTS trg_payments_recalc_order ON public.payments;
DROP TRIGGER IF EXISTS trg_payments_recalc_paid ON public.payments;
DROP TRIGGER IF EXISTS trg_payments_set_customer ON public.payments;
DROP TRIGGER IF EXISTS trg_set_updated_metadata ON public.profiles;
DROP TRIGGER IF EXISTS trg_set_updated_metadata ON public.tenant_users;
DROP TRIGGER IF EXISTS trg_set_updated_metadata ON public.tenants;
DROP TRIGGER IF EXISTS tenants_ensure_owner_membership ON public.tenants;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP FUNCTION IF EXISTS public.trg_movements_update_stock();
DROP FUNCTION IF EXISTS public.trg_products_initial_stock();
DROP FUNCTION IF EXISTS public.trg_generate_tenant_counter();
DROP FUNCTION IF EXISTS public.trg_order_recalc_totals();
DROP FUNCTION IF EXISTS public.trg_payments_recalc_order();
DROP FUNCTION IF EXISTS public.trg_payments_recalc_paid();
DROP FUNCTION IF EXISTS public.trg_payments_set_customer();
DROP FUNCTION IF EXISTS public.set_updated_metadata();
DROP FUNCTION IF EXISTS public.ensure_owner_membership();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.create_triggers_for_all_tables();

-- 3. New Standardized Functions

-- Function: Sync Stock based on Movement Type
CREATE OR REPLACE FUNCTION public.fn_tr_product_movements_sync_stock()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_prod_id uuid;
  v_is_service boolean;
BEGIN
  -- Prevent changing product_id
  IF TG_OP = 'UPDATE' AND NEW.product_id <> OLD.product_id THEN
    RAISE EXCEPTION 'Changing product_id in movements is not allowed';
  END IF;

  v_prod_id := COALESCE(NEW.product_id, OLD.product_id);

  SELECT is_service INTO v_is_service FROM public.products WHERE id = v_prod_id;
  
  IF v_is_service THEN 
    RETURN NULL; 
  END IF;

  -- Logic:
  -- INSERT: Apply effect of NEW
  -- DELETE: Reverse effect of OLD
  -- UPDATE: Reverse OLD, Apply NEW

  IF TG_OP = 'INSERT' THEN
    IF NEW.type IN ('in', 'adjustment') THEN
      UPDATE public.products SET stock = stock + NEW.quantity WHERE id = NEW.product_id;
    ELSE -- out
      UPDATE public.products SET stock = stock - NEW.quantity WHERE id = NEW.product_id;
    END IF;
  
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.type IN ('in', 'adjustment') THEN
      UPDATE public.products SET stock = stock - OLD.quantity WHERE id = OLD.product_id;
    ELSE -- out
      UPDATE public.products SET stock = stock + OLD.quantity WHERE id = OLD.product_id;
    END IF;

  ELSIF TG_OP = 'UPDATE' THEN
    -- Reverse OLD
    IF OLD.type IN ('in', 'adjustment') THEN
      UPDATE public.products SET stock = stock - OLD.quantity WHERE id = OLD.product_id;
    ELSE -- out
      UPDATE public.products SET stock = stock + OLD.quantity WHERE id = OLD.product_id;
    END IF;

    -- Apply NEW
    IF NEW.type IN ('in', 'adjustment') THEN
      UPDATE public.products SET stock = stock + NEW.quantity WHERE id = NEW.product_id;
    ELSE -- out
      UPDATE public.products SET stock = stock - NEW.quantity WHERE id = NEW.product_id;
    END IF;
  END IF;

  RETURN NULL;
END;
$$;

-- Function: Handle Initial Stock on Product Creation
CREATE OR REPLACE FUNCTION public.fn_tr_products_handle_initial_stock()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_initial numeric;
BEGIN
  v_initial := COALESCE(NEW.stock, 0);
  
  IF NEW.is_service OR v_initial <= 0 THEN
    RETURN NEW;
  END IF;

  -- Reset stock to 0 first, so the movement trigger can correctly add the stock back
  UPDATE public.products 
  SET stock = 0 
  WHERE id = NEW.id;

  -- Create 'in' movement
  INSERT INTO public.product_movements (
    tenant_id, product_id, quantity, unit_cost, reference, note, type
  ) VALUES (
    NEW.tenant_id, NEW.id, v_initial, COALESCE(NEW.cost, 0),
    'initial_stock', 'Stock Inicial', 'in'
  );

  RETURN NEW;
END;
$$;

-- Function: Generate Tenant Counter (Shared)
CREATE OR REPLACE FUNCTION public.fn_tr_shared_generate_counter()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  next_number integer;
  pad_len     int := 6;
  target_col  text := TG_ARGV[2];
  doc_prefix  text := TG_ARGV[1];
  counter_key text := TG_ARGV[0];
  doc_value   text;
BEGIN
  IF array_length(TG_ARGV, 1) >= 4 THEN
    pad_len := nullif(TG_ARGV[3], '')::int;
  END IF;

  -- Increment counter
  INSERT INTO tenant_counters (tenant_id, counter_key, last_number)
  VALUES (NEW.tenant_id, counter_key, 1)
  ON CONFLICT (tenant_id, counter_key)
  DO UPDATE SET last_number = tenant_counters.last_number + 1
  RETURNING tenant_counters.last_number INTO next_number;

  -- Format value
  doc_value := doc_prefix || '-' || lpad(next_number::text, pad_len, '0');

  -- Assign to NEW column dynamically using JSON trick or specific assignment if possible.
  -- PL/pgSQL doesn't support dynamic NEW assignment easily without EXECUTE which doesn't work on NEW directly in BEFORE trigger.
  -- However, since we know this is used for specific tables, we might need specific functions if we can't use dynamic assignment.
  -- BUT, we can use the JSONB workaround:
  NEW := json_populate_record(NEW, json_build_object(target_col, doc_value));
  
  RETURN NEW;
END;
$$;

-- Function: Sync Order Totals from Items
CREATE OR REPLACE FUNCTION public.fn_tr_order_items_sync_order_total()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE 
  v_order_id uuid;
BEGIN
  v_order_id := COALESCE(NEW.order_id, OLD.order_id);

  UPDATE orders 
  SET total = COALESCE((SELECT SUM(total) FROM order_items WHERE order_id = v_order_id), 0)
  WHERE id = v_order_id;

  RETURN NULL;
END;
$$;

-- Function: Sync Order Status and Paid Amount
CREATE OR REPLACE FUNCTION public.fn_tr_payments_sync_order_totals()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_order_id uuid;
  v_paid     numeric;
  v_total    numeric;
BEGIN
  v_order_id := COALESCE(NEW.order_id, OLD.order_id);
  
  IF v_order_id IS NULL THEN RETURN NULL; END IF;

  SELECT COALESCE(SUM(amount), 0) INTO v_paid FROM public.payments WHERE order_id = v_order_id;
  SELECT total INTO v_total FROM public.orders WHERE id = v_order_id;

  UPDATE public.orders
  SET paid_amount = v_paid,
      status = CASE 
        WHEN v_paid >= v_total AND v_total > 0 THEN 'paid'::order_status
        WHEN v_paid > 0 THEN 'partial_payment'::order_status
        ELSE status 
      END
  WHERE id = v_order_id;

  RETURN NULL;
END;
$$;

-- Function: Set Customer on Payment
CREATE OR REPLACE FUNCTION public.fn_tr_payments_set_customer()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.order_id IS DISTINCT FROM OLD.order_id) THEN
    IF NEW.order_id IS NOT NULL THEN
       SELECT customer_id INTO NEW.customer_id FROM orders WHERE id = NEW.order_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Function: Shared Audit (Updated At/By)
CREATE OR REPLACE FUNCTION public.fn_tr_shared_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW IS DISTINCT FROM OLD THEN
    NEW.updated_at := timezone('utc', now());
  END IF;

  IF NEW.updated_by IS NULL THEN
    NEW.updated_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

-- Function: Ensure Tenant Owner Membership
CREATE OR REPLACE FUNCTION public.fn_tr_tenants_add_owner_as_user()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.tenant_users (tenant_id, user_id, role_id, is_superuser, created_by, updated_by)
  VALUES (
    NEW.id,
    NEW.owner_id,
    NULL, -- Role needs to be assigned logic separately or allow null
    true,
    COALESCE(auth.uid(), NEW.owner_id),
    COALESCE(auth.uid(), NEW.owner_id)
  )
  ON CONFLICT (tenant_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Function: Handle New Auth User
CREATE OR REPLACE FUNCTION public.fn_tr_auth_users_handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;


-- 4. Create New Standardized Triggers

-- Order Items -> Orders
CREATE TRIGGER tr_order_items_recalc_totals
AFTER INSERT OR UPDATE OR DELETE ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.fn_tr_order_items_sync_order_total();

-- Orders -> Number Generation
CREATE TRIGGER tr_orders_generate_number
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.fn_tr_shared_generate_counter('order', 'ORD', 'order_number', '6');

-- Payments -> Orders Status
CREATE TRIGGER tr_payments_sync_order_totals
AFTER INSERT OR UPDATE OR DELETE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.fn_tr_payments_sync_order_totals();

-- Payments -> Set Customer
CREATE TRIGGER tr_payments_set_customer
BEFORE INSERT OR UPDATE OF order_id ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.fn_tr_payments_set_customer();

-- Product Movements -> Stock
CREATE TRIGGER tr_product_movements_sync_stock
AFTER INSERT OR UPDATE OR DELETE ON public.product_movements
FOR EACH ROW EXECUTE FUNCTION public.fn_tr_product_movements_sync_stock();

-- Products -> Initial Stock
CREATE TRIGGER tr_products_initial_stock
AFTER INSERT ON public.products
FOR EACH ROW EXECUTE FUNCTION public.fn_tr_products_handle_initial_stock();

-- Tenants -> Owner Membership
CREATE TRIGGER tr_tenants_ensure_owner_membership
AFTER INSERT ON public.tenants
FOR EACH ROW EXECUTE FUNCTION public.fn_tr_tenants_add_owner_as_user();

-- Auth Users -> Profile
CREATE TRIGGER tr_auth_users_handle_new_user
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.fn_tr_auth_users_handle_new_user();


-- 5. Apply Audit Trigger Globally
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT table_schema, table_name
    FROM information_schema.columns
    WHERE column_name = 'updated_at'
      AND table_schema = 'public'
      AND table_name IN (SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE')
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS tr_%I_set_metadata ON %I.%I', r.table_name, r.table_schema, r.table_name);
    EXECUTE format('CREATE TRIGGER tr_%I_set_metadata BEFORE UPDATE ON %I.%I FOR EACH ROW EXECUTE FUNCTION public.fn_tr_shared_set_updated_at()', r.table_name, r.table_schema, r.table_name);
  END LOOP;
END $$;

COMMIT;
