alter table "public"."tenants" drop constraint "tenants_subdomain_chk";

alter table "public"."product_movements" drop column if exists "type";

alter table "public"."tenants" add constraint "tenants_subdomain_chk" CHECK (((subdomain IS NULL) OR (((length(subdomain) >= 3) AND (length(subdomain) <= 63)) AND (subdomain ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$'::text)))) not valid;

alter table "public"."tenants" validate constraint "tenants_subdomain_chk";


