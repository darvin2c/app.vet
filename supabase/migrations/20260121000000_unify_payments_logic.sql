-- Migration: Unify Payments Logic and Remove Order Status
-- Date: 2026-01-21
-- Description: 
-- 1. Removes 'status' column from 'orders'.
-- 2. Consolidates payment triggers into a single 'fn_tr_payments_manager'.
-- 3. Implements logic to set customer and update order totals/balance.

BEGIN;

-- 1. Remove status column from orders
-- First drop views or dependent objects if any (assuming none strict for now)
ALTER TABLE public.orders DROP COLUMN IF EXISTS status;

-- Drop the enum type if it's no longer used by other tables, 
-- but it might be used by TS types or other logic, so we keep it or check usage.
-- We'll keep the enum 'order_status' for now to avoid breaking other potential references not checked.

-- 2. Drop Old Triggers and Functions
DROP TRIGGER IF EXISTS tr_payments_sync_order_totals ON public.payments;
DROP TRIGGER IF EXISTS tr_payments_set_customer ON public.payments;

DROP FUNCTION IF EXISTS public.fn_tr_payments_sync_order_totals();
DROP FUNCTION IF EXISTS public.fn_tr_payments_set_customer();

-- 3. Create Unified Function
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
  -- Logic: If order_id exists and (customer_id is null OR order_id changed), sync from order
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
  -- Get amounts
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

  -- Perform Update
  IF v_delta <> 0 THEN
    UPDATE public.orders
    SET 
      paid_amount = COALESCE(paid_amount, 0) + v_delta,
      balance = total - (COALESCE(paid_amount, 0) + v_delta),
      updated_at = timezone('utc', now())
    WHERE id = v_order_id;
  END IF;

  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;

-- 4. Create Unified Trigger
CREATE TRIGGER tr_payments_manager
BEFORE INSERT OR UPDATE OR DELETE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.fn_tr_payments_manager();

-- 5. Fix: Ensure Order Items update Balance too when Total changes
-- We need to update the existing fn_tr_order_items_sync_order_total to also recalc balance
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

  -- Update Total AND Balance (Balance = Total - Paid)
  UPDATE orders 
  SET 
    total = v_new_total,
    balance = v_new_total - COALESCE(paid_amount, 0)
  WHERE id = v_order_id;

  RETURN NULL;
END;
$$;

COMMIT;
