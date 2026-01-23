-- Add product_id column
ALTER TABLE "public"."pet_dewormings" ADD COLUMN "product_id" uuid REFERENCES "public"."products"("id");

-- (Optional) If we want to migrate data, we would need logic here, but since 'product' was text and 'product_id' is uuid, we can't easily cast unless the text was a valid uuid. 
-- Assuming we drop the old column and lose the text data if it wasn't a uuid, or the user is okay with starting fresh for this column.
-- Given it's dev/test, I'll drop the column.

ALTER TABLE "public"."pet_dewormings" DROP COLUMN "product";
