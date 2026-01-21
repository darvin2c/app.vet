-- Migration: Fix Initial Stock Trigger Definitive
-- Date: 2026-01-20
-- Description: Ensures the initial stock trigger works correctly by handling stock reset and movement creation properly.

BEGIN;

-- 1. Redefine the function with explicit column mapping and safety checks
CREATE OR REPLACE FUNCTION public.fn_tr_products_handle_initial_stock()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_initial numeric;
BEGIN
  -- Get initial stock, default to 0
  v_initial := COALESCE(NEW.stock, 0);
  
  -- Exit if no stock or is service
  IF NEW.is_service OR v_initial <= 0 THEN
    RETURN NEW;
  END IF;

  -- 1. Reset stock to 0. 
  -- This is crucial because the movement trigger (tr_product_movements_sync_stock) will add the quantity back.
  -- If we don't reset, we'll end up with double the stock (Initial + Movement).
  UPDATE public.products 
  SET stock = 0 
  WHERE id = NEW.id;

  -- 2. Create the movement
  -- Explicitly mapping all relevant fields including created_by/tenant_id
  INSERT INTO public.product_movements (
    tenant_id,
    product_id,
    quantity,
    unit_cost,
    reference,
    note,
    created_by,
    created_at
  ) VALUES (
    NEW.tenant_id,
    NEW.id,
    v_initial,
    COALESCE(NEW.cost, 0),
    '',
    'Stock Inicial',
    NEW.created_by,
    NOW()
  );

  RETURN NEW;
END;
$$;

-- 2. Ensure the trigger exists and is attached
DROP TRIGGER IF EXISTS tr_products_initial_stock ON public.products;

CREATE TRIGGER tr_products_initial_stock
AFTER INSERT ON public.products
FOR EACH ROW EXECUTE FUNCTION public.fn_tr_products_handle_initial_stock();

COMMIT;
