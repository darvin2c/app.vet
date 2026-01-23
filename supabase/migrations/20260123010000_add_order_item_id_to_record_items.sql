ALTER TABLE "public"."record_items" ADD COLUMN "order_item_id" uuid;

ALTER TABLE "public"."record_items"
    ADD CONSTRAINT "record_items_order_item_id_fkey"
    FOREIGN KEY ("order_item_id")
    REFERENCES "public"."order_items"("id")
    ON DELETE SET NULL;

create index record_items_order_item_id_idx on public.record_items (order_item_id);
