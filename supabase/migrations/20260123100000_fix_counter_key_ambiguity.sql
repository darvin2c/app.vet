-- Migration: Fix ambiguous column reference in fn_tr_shared_generate_counter
-- Description: Renames variables to standard v_ (variable) and p_ (parameter) prefixes to avoid conflicts.
--              Also updates to use jsonb_* functions for better performance and consistency.

CREATE OR REPLACE FUNCTION public.fn_tr_shared_generate_counter()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  p_pad_len     int := 6;
  p_target_col  text := TG_ARGV[2];
  p_doc_prefix  text := TG_ARGV[1];
  p_counter_key text := TG_ARGV[0];
  v_next_number integer;
  v_doc_value   text;
BEGIN
  IF array_length(TG_ARGV, 1) >= 4 THEN
    p_pad_len := nullif(TG_ARGV[3], '')::int;
  END IF;

  -- Increment counter
  INSERT INTO tenant_counters (tenant_id, counter_key, last_number)
  VALUES (NEW.tenant_id, p_counter_key, 1)
  ON CONFLICT (tenant_id, counter_key)
  DO UPDATE SET last_number = tenant_counters.last_number + 1
  RETURNING tenant_counters.last_number INTO v_next_number;

  -- Format value
  v_doc_value := p_doc_prefix || '-' || lpad(v_next_number::text, p_pad_len, '0');

  -- Assign to NEW column dynamically using JSONB trick
  NEW := jsonb_populate_record(NEW, jsonb_build_object(p_target_col, v_doc_value));
  
  RETURN NEW;
END;
$$;
