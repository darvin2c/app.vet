-- Migration: Remove order_status enum
-- Date: 2026-01-23
-- Description: Completely removes the order_status enum type. The status column was likely removed in a previous migration, but we ensure it here.

BEGIN;

-- Ensure status column is definitely gone (idempotent)
ALTER TABLE public.orders DROP COLUMN IF EXISTS status;

-- Drop the type
DROP TYPE IF EXISTS public.order_status;

COMMIT;
