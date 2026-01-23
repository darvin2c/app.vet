ALTER TABLE "public"."orders" ADD COLUMN "pet_id" uuid;

ALTER TABLE "public"."orders"
    ADD CONSTRAINT "orders_pet_id_fkey"
    FOREIGN KEY ("pet_id")
    REFERENCES "public"."pets"("id")
    ON DELETE SET NULL;

create index orders_pet_id_idx on public.orders (pet_id);
