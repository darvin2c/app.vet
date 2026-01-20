-- Migration: Fix Product Movements Quantity Check Constraint
-- Date: 2026-01-20
-- Description: Allow negative quantities for algebraic sum logic (entries +, exits -)

BEGIN;

ALTER TABLE "public"."product_movements" DROP CONSTRAINT IF EXISTS "product_movements_quantity_check";

COMMIT;
