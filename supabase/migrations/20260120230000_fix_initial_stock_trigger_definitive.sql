-- Migration: Fix Initial Stock Trigger Definitive & Add Cost Recalculation
-- Date: 2026-01-20
-- Description: Ensures initial stock trigger works and adds automatic weighted average cost recalculation.

BEGIN;

-- 1. Cleanup Old Triggers and Functions (Safety First)
-- Remove all possible variations of the initial stock trigger
DROP TRIGGER IF EXISTS trg_products_initial_stock ON public.products; -- Old legacy name
DROP TRIGGER IF EXISTS tr_products_initial_stock ON public.products;  -- Previous standardized name
DROP TRIGGER IF EXISTS tr_products_create_initial_movement ON public.products; -- Current name (for idempotency)

-- Remove old functions to avoid confusion
DROP FUNCTION IF EXISTS public.trg_products_initial_stock();
DROP FUNCTION IF EXISTS public.fn_tr_products_handle_initial_stock();

-- 2. Initial Stock Trigger Function (Renamed and Improved)
CREATE OR REPLACE FUNCTION public.fn_products_create_initial_movement()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_initial_stock numeric;
  v_initial_cost numeric;
BEGIN
  -- Get initial values, default to 0
  v_initial_stock := COALESCE(NEW.stock, 0);
  v_initial_cost := COALESCE(NEW.cost, 0);
  
  -- Exit if no stock or is service
  -- We only create movement if there is actual stock to initialize
  IF NEW.is_service OR v_initial_stock <= 0 THEN
    RETURN NEW;
  END IF;

  -- 1. Reset stock to 0. 
  -- This is crucial because the movement trigger (tr_product_movements_sync_stock) will add the quantity back.
  -- If we don't reset, we'll end up with double the stock (Initial + Movement).
  UPDATE public.products 
  SET stock = 0 
  WHERE id = NEW.id;

  -- 2. Create the initial movement
  -- This movement will trigger:
  -- a) tr_product_movements_sync_stock -> Adds stock back to products
  -- b) tr_product_movements_z_recalculate_cost -> Sets/Confirms the cost
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
    v_initial_stock,
    v_initial_cost,
    '',
    'Movimiento Inicial',
    NEW.created_by,
    NOW()
  );

  RETURN NEW;
END;
$$;

-- 3. Attach Initial Stock Trigger (Renamed)
CREATE TRIGGER tr_products_create_initial_movement
AFTER INSERT ON public.products
FOR EACH ROW EXECUTE FUNCTION public.fn_products_create_initial_movement();


-- 4. Cost Recalculation Trigger Function (Existing Logic)
CREATE OR REPLACE FUNCTION public.fn_tr_product_movements_recalculate_cost()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_current_stock numeric;
  v_current_cost numeric;
  v_old_stock numeric;
  v_new_cost numeric;
BEGIN
  -- Only recalculate on positive entries with cost
  IF NEW.quantity <= 0 OR NEW.unit_cost IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get current product state
  -- Note: Stock is ALREADY updated by tr_product_movements_sync_stock because it runs alphabetically earlier (s vs z)
  SELECT stock, cost INTO v_current_stock, v_current_cost 
  FROM public.products 
  WHERE id = NEW.product_id;

  v_current_stock := COALESCE(v_current_stock, 0);
  v_current_cost := COALESCE(v_current_cost, 0);

  -- Calculate Old Stock (before this movement)
  v_old_stock := v_current_stock - NEW.quantity;

  -- Calculate New Cost (Weighted Average)
  IF v_old_stock <= 0 THEN
    v_new_cost := NEW.unit_cost;
  ELSE
    -- Formula: ((OldStock * OldCost) + (NewQty * NewCost)) / (OldStock + NewQty)
    v_new_cost := ((v_old_stock * v_current_cost) + (NEW.quantity * NEW.unit_cost)) / v_current_stock;
  END IF;

  -- Update Product Cost
  UPDATE public.products
  SET cost = v_new_cost
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$;

-- 5. Attach Cost Recalculation Trigger
DROP TRIGGER IF EXISTS tr_product_movements_z_recalculate_cost ON public.product_movements;

CREATE TRIGGER tr_product_movements_z_recalculate_cost
AFTER INSERT ON public.product_movements
FOR EACH ROW EXECUTE FUNCTION public.fn_tr_product_movements_recalculate_cost();

COMMIT;
