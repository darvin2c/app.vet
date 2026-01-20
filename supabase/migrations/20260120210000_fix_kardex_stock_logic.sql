-- Migration: Fix Kardex Stock Logic (Algebraic Sum Only)
-- Date: 2026-01-20

BEGIN;

-- Function: Sync Stock (Algebraic Sum)
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

  -- Logic: Algebraic Sum
  -- We trust the sign of 'quantity'.
  -- INSERT: stock + quantity
  -- DELETE: stock - quantity (reverse effect)
  -- UPDATE: stock - old_quantity + new_quantity

  IF TG_OP = 'INSERT' THEN
    UPDATE public.products 
    SET stock = stock + NEW.quantity 
    WHERE id = NEW.product_id;
  
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.products 
    SET stock = stock - OLD.quantity 
    WHERE id = OLD.product_id;

  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.products 
    SET stock = stock - OLD.quantity + NEW.quantity 
    WHERE id = NEW.product_id;
  END IF;

  RETURN NULL;
END;
$$;

-- Ensure the trigger uses this function
DROP TRIGGER IF EXISTS tr_product_movements_sync_stock ON public.product_movements;

CREATE TRIGGER tr_product_movements_sync_stock
AFTER INSERT OR UPDATE OR DELETE ON public.product_movements
FOR EACH ROW EXECUTE FUNCTION public.fn_tr_product_movements_sync_stock();



COMMIT;
