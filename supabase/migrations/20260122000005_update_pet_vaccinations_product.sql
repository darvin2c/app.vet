-- Add product_id column to pet_vaccinations
ALTER TABLE "public"."pet_vaccinations" ADD COLUMN "product_id" uuid REFERENCES "public"."products"("id");
