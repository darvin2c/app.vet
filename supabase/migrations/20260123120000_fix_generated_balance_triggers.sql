-- Migration: Fix triggers to stop updating generated column 'balance'
-- Description: Updates fn_tr_payments_manager and fn_tr_order_items_sync_order_total
--              to avoid manually updating the 'balance' column, which is generated always.

-- 1. Fix fn_tr_payments_manager
CREATE OR REPLACE FUNCTION public.fn_tr_payments_manager()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_order_id      uuid;
  v_current_amount numeric := 0;
  v_old_amount    numeric := 0;
  v_delta         numeric := 0;
BEGIN
  -- Prevent changing order_id if already set
  IF TG_OP = 'UPDATE' AND OLD.order_id IS NOT NULL AND NEW.order_id IS DISTINCT FROM OLD.order_id THEN
    RAISE EXCEPTION 'No se puede mover un pago a otra orden ni desvincularlo.';
  END IF;

  -- Determine Order ID
  IF TG_OP = 'DELETE' THEN
    v_order_id := OLD.order_id;
  ELSE
    v_order_id := NEW.order_id;
  END IF;

  -- 1. Set Customer (Only for INSERT/UPDATE)
  IF TG_OP IN ('INSERT', 'UPDATE') AND NEW.order_id IS NOT NULL THEN
    IF TG_OP = 'INSERT' OR NEW.order_id IS DISTINCT FROM OLD.order_id OR NEW.customer_id IS NULL THEN
       NEW.customer_id := (SELECT customer_id FROM public.orders WHERE id = NEW.order_id);
    END IF;
  END IF;

  -- If no order related, just return
  IF v_order_id IS NULL THEN
    IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
  END IF;

  -- 2. Update Orders Totals (Delta Calculation)
  IF TG_OP = 'INSERT' THEN
    v_current_amount := COALESCE(NEW.amount, 0);
    v_old_amount := 0;
  ELSIF TG_OP = 'UPDATE' THEN
    v_current_amount := COALESCE(NEW.amount, 0);
    v_old_amount := COALESCE(OLD.amount, 0);
  ELSIF TG_OP = 'DELETE' THEN
    v_current_amount := 0;
    v_old_amount := COALESCE(OLD.amount, 0);
  END IF;

  v_delta := v_current_amount - v_old_amount;

  -- Perform Update (Removed 'balance' update)
  IF v_delta <> 0 THEN
    UPDATE public.orders
    SET 
      paid_amount = COALESCE(paid_amount, 0) + v_delta,
      updated_at = timezone('utc', now())
    WHERE id = v_order_id;
  END IF;

  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;

-- 2. Fix fn_tr_order_items_sync_order_total
CREATE OR REPLACE FUNCTION public.fn_tr_order_items_sync_order_total()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE 
  v_order_id uuid;
  v_new_total numeric;
BEGIN
  v_order_id := COALESCE(NEW.order_id, OLD.order_id);

  -- Calculate new total
  SELECT COALESCE(SUM(total), 0) INTO v_new_total 
  FROM order_items 
  WHERE order_id = v_order_id;

  -- Update Total (Removed 'balance' update)
  UPDATE orders 
  SET 
    total = v_new_total
  WHERE id = v_order_id;

  RETURN NULL;
END;
$$;
