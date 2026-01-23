-- Migration: Add updated_by to tables missing it
-- Description: Adds updated_by column to tables that have updated_at but lack updated_by,
--              ensuring compatibility with the global audit trigger.

DO $$ 
BEGIN
  -- 1. Fix tenant_counters
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tenant_counters' AND column_name = 'updated_by') THEN
    ALTER TABLE public.tenant_counters 
    ADD COLUMN updated_by uuid DEFAULT auth.uid();

    ALTER TABLE public.tenant_counters 
    ADD CONSTRAINT tenant_counters_updated_by_fkey 
    FOREIGN KEY (updated_by) REFERENCES auth.users(id);
  END IF;

  -- 2. Fix profiles
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'updated_by') THEN
    ALTER TABLE public.profiles 
    ADD COLUMN updated_by uuid DEFAULT auth.uid();

    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_updated_by_fkey 
    FOREIGN KEY (updated_by) REFERENCES auth.users(id);
  END IF;

END $$;
