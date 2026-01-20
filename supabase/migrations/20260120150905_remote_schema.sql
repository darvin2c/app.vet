drop extension if exists "pg_net";

create type "public"."appointment_status" as enum ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');

create type "public"."invitation_status" as enum ('pending', 'accepted', 'expired', 'revoked');

create type "public"."order_status" as enum ('partial_payment', 'confirmed', 'paid', 'cancelled', 'refunded');

create type "public"."payment_type" as enum ('cash', 'card', 'transfer', 'wallet', 'other');

create type "public"."pet_sex" as enum ('M', 'F');

create type "public"."record_type" as enum ('consultation', 'vaccination', 'surgery', 'hospitalization', 'deworming');


  create table "public"."appointment_types" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "name" text not null,
    "description" text,
    "color" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_by" uuid
      );



  create table "public"."appointments" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "pet_id" uuid not null,
    "veterinarian_id" uuid,
    "appointment_type_id" uuid not null,
    "status" public.appointment_status not null default 'scheduled'::public.appointment_status,
    "scheduled_start" timestamp with time zone not null,
    "scheduled_end" timestamp with time zone not null,
    "reason" text,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_by" uuid
      );



  create table "public"."boardings" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "treatment_id" uuid not null,
    "check_in_at" timestamp with time zone not null,
    "check_out_at" timestamp with time zone,
    "kennel_id" uuid,
    "daily_rate" numeric(12,2),
    "feeding_notes" text,
    "observations" text
      );



  create table "public"."breeds" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "species_id" uuid not null,
    "name" text not null,
    "description" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_by" uuid
      );



  create table "public"."clinical_notes" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "note" text not null,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "clinical_record_id" uuid not null,
    "updated_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "pet_id" uuid not null,
    "vet_id" uuid
      );



  create table "public"."clinical_parameters" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "clinical_record_id" uuid not null,
    "params" jsonb not null,
    "schema_version" smallint not null default 1,
    "measured_at" timestamp with time zone not null default now(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_by" uuid,
    "pet_id" uuid not null
      );



  create table "public"."clinical_records" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "pet_id" uuid not null,
    "vet_id" uuid,
    "appointment_id" uuid,
    "record_type" public.record_type not null,
    "record_date" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "reason" text,
    "diagnosis" text,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_by" uuid
      );



  create table "public"."customers" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "doc_id" text not null,
    "first_name" text not null,
    "email" text,
    "phone" text,
    "address" text,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_by" uuid,
    "last_name" text not null
      );



  create table "public"."hospitalizations" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "admission_at" timestamp with time zone not null,
    "discharge_at" timestamp with time zone,
    "daily_rate" numeric(12,2),
    "bed_id" uuid,
    "notes" text,
    "pet_id" uuid not null
      );



  create table "public"."invitations" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "email" text not null,
    "token" text not null,
    "status" public.invitation_status not null default 'pending'::public.invitation_status,
    "role_id" uuid not null,
    "expires_at" timestamp with time zone not null,
    "accepted_at" timestamp with time zone,
    "metadata" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "created_by" uuid not null default auth.uid()
      );



  create table "public"."order_items" (
    "id" uuid not null default gen_random_uuid(),
    "order_id" uuid not null,
    "product_id" uuid not null,
    "description" text not null,
    "quantity" numeric(10,2) not null,
    "discount" numeric(12,2) not null,
    "price_base" numeric not null,
    "unit_price" numeric generated always as ((price_base - discount)) stored,
    "total" numeric generated always as (((price_base - discount) * quantity)) stored,
    "tenant_id" uuid
      );



  create table "public"."orders" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "customer_id" uuid,
    "order_number" text,
    "status" public.order_status not null,
    "tax" numeric(12,2) not null default 0,
    "total" numeric(12,2) not null default 0,
    "paid_amount" numeric(12,2) not null default 0,
    "balance" numeric(12,2) generated always as ((total - paid_amount)) stored,
    "notes" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_by" uuid,
    "tax_amount" numeric generated always as (round((total - (total / ((1)::numeric + (tax / (100)::numeric)))), 2)) stored,
    "subtotal" numeric generated always as (round((total / ((1)::numeric + (tax / (100)::numeric))), 2)) stored
      );



  create table "public"."otps" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "email" text not null,
    "code" text not null,
    "attempts" integer not null default 0,
    "max_attempts" integer not null default 3,
    "expires_at" timestamp with time zone not null,
    "consumed_at" timestamp with time zone,
    "metadata" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid
      );



  create table "public"."payment_methods" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "name" text not null,
    "payment_type" public.payment_type not null,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "created_by" uuid,
    "updated_by" uuid,
    "ref_required" boolean not null default false
      );



  create table "public"."payments" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "customer_id" uuid,
    "order_id" uuid,
    "payment_method_id" uuid not null,
    "payment_date" timestamp with time zone not null default now(),
    "amount" numeric(12,2) not null,
    "reference" text,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_by" uuid
      );



  create table "public"."pets" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "customer_id" uuid not null,
    "name" text not null,
    "species_id" uuid not null default gen_random_uuid(),
    "breed_id" uuid default gen_random_uuid(),
    "sex" public.pet_sex not null,
    "birth_date" date,
    "weight" numeric(10,2),
    "color" text,
    "microchip" text,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_by" uuid,
    "is_active" boolean default true
      );



  create table "public"."product_brands" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "name" text not null,
    "description" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone not null default now(),
    "updated_by" uuid default auth.uid()
      );



  create table "public"."product_categories" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "name" text not null,
    "description" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone not null default now(),
    "updated_by" uuid default auth.uid()
      );



  create table "public"."product_movements" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "product_id" uuid not null,
    "quantity" numeric(14,3) not null,
    "unit_cost" numeric(12,2) default 0,
    "reference" text,
    "note" text,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone not null default now(),
    "updated_by" uuid default auth.uid()
      );



  create table "public"."product_units" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "name" text not null,
    "abbreviation" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone not null default now(),
    "updated_by" uuid default auth.uid()
      );



  create table "public"."products" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "name" text not null,
    "sku" text,
    "barcode" text,
    "is_service" boolean not null default false,
    "cost" numeric(12,2) default 0,
    "price" numeric(12,2) not null default 0,
    "stock" numeric(14,3) not null default 0,
    "notes" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone not null default now(),
    "updated_by" uuid default auth.uid(),
    "unit_id" uuid,
    "category_id" uuid,
    "brand_id" uuid
      );



  create table "public"."profiles" (
    "id" uuid not null,
    "first_name" text,
    "last_name" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "email" text,
    "phone" text,
    "date_of_birth" date,
    "address" jsonb,
    "avatar_url" text
      );



  create table "public"."record_items" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "record_id" uuid not null,
    "product_id" uuid not null,
    "qty" numeric(12,3) not null,
    "unit_price" numeric(12,2) not null,
    "discount" numeric(12,2) default 0,
    "notes" text,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid
      );



  create table "public"."roles" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "name" text not null,
    "description" text,
    "perms" text[] not null,
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "updated_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "created_by" uuid default auth.uid(),
    "updated_by" uuid default auth.uid()
      );



  create table "public"."specialties" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "name" text not null,
    "description" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_by" uuid
      );



  create table "public"."species" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "name" text not null,
    "description" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "updated_by" uuid
      );



  create table "public"."staff" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "user_id" uuid,
    "first_name" text not null,
    "email" text,
    "phone" text,
    "license_number" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_by" uuid default auth.uid(),
    "last_name" text,
    "address" text
      );



  create table "public"."staff_specialties" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "staff_id" uuid not null,
    "specialty_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid
      );



  create table "public"."supplier_brands" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "supplier_id" uuid not null,
    "brand_id" uuid not null,
    "is_primary" boolean not null default false,
    "notes" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone not null default now(),
    "updated_by" uuid default auth.uid()
      );



  create table "public"."suppliers" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "name" text not null,
    "document_number" text,
    "email" text,
    "phone" text,
    "address" text,
    "contact_person" text,
    "website" text,
    "notes" text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone not null default now(),
    "updated_by" uuid default auth.uid()
      );



  create table "public"."surgeries" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "treatment_id" uuid not null,
    "duration_min" integer,
    "complications" text,
    "surgeon_notes" text
      );



  create table "public"."tenant_counters" (
    "tenant_id" uuid not null,
    "counter_key" text not null,
    "last_number" integer not null default 0,
    "updated_at" timestamp with time zone not null default now()
      );



  create table "public"."tenant_users" (
    "tenant_id" uuid not null,
    "user_id" uuid not null,
    "is_active" boolean not null default true,
    "invited_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid not null default auth.uid(),
    "updated_by" uuid not null default auth.uid(),
    "role_id" uuid,
    "is_superuser" boolean default false
      );



  create table "public"."tenants" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "legal_name" text,
    "tax" numeric,
    "email" text,
    "phone" text,
    "address" jsonb,
    "subdomain" text,
    "is_active" boolean not null default true,
    "owner_id" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid not null default auth.uid(),
    "updated_by" uuid not null default auth.uid(),
    "timezone" text,
    "currency" text,
    "business_hours" jsonb
      );



  create table "public"."trainings" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "treatment_id" uuid not null,
    "trainer_id" uuid,
    "sessions_planned" integer,
    "sessions_completed" integer default 0,
    "goal" text,
    "progress_notes" text
      );



  create table "public"."vaccinations" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "clinical_record_id" uuid not null,
    "dose" text,
    "route" text,
    "site" text,
    "next_due_at" date,
    "adverse_event" text,
    "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
    "created_by" uuid default auth.uid(),
    "updated_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text)
      );


CREATE UNIQUE INDEX appointment_types_pkey ON public.appointment_types USING btree (id);

CREATE UNIQUE INDEX appointment_types_tenant_id_name_key ON public.appointment_types USING btree (tenant_id, name);

CREATE UNIQUE INDEX appointments_pkey ON public.appointments USING btree (id);

CREATE UNIQUE INDEX boardings_pkey ON public.boardings USING btree (id);

CREATE UNIQUE INDEX breeds_pkey ON public.breeds USING btree (id);

CREATE UNIQUE INDEX breeds_tenant_id_species_id_name_key ON public.breeds USING btree (tenant_id, species_id, name);

CREATE UNIQUE INDEX clients_pkey ON public.customers USING btree (id);

CREATE UNIQUE INDEX clients_tenant_id_document_number_key ON public.customers USING btree (tenant_id, doc_id);

CREATE UNIQUE INDEX clinical_notes_pkey ON public.clinical_notes USING btree (id);

CREATE UNIQUE INDEX clinical_parameters_pkey ON public.clinical_parameters USING btree (id);

CREATE UNIQUE INDEX clinical_records_pkey ON public.clinical_records USING btree (id);

CREATE UNIQUE INDEX hospitalizations_pkey ON public.hospitalizations USING btree (id);

CREATE INDEX idx_payments_order_id ON public.payments USING btree (order_id);

CREATE UNIQUE INDEX invitations_pkey ON public.invitations USING btree (id);

CREATE UNIQUE INDEX order_items_pkey ON public.order_items USING btree (id);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE UNIQUE INDEX otps_pkey ON public.otps USING btree (id);

CREATE UNIQUE INDEX otps_tenant_email_code_unique ON public.otps USING btree (tenant_id, email, code);

CREATE UNIQUE INDEX payment_methods_pkey ON public.payment_methods USING btree (id);

CREATE UNIQUE INDEX payments_pkey ON public.payments USING btree (id);

CREATE UNIQUE INDEX pets_pkey ON public.pets USING btree (id);

CREATE UNIQUE INDEX product_brands_pkey ON public.product_brands USING btree (id);

CREATE UNIQUE INDEX product_categories_pkey ON public.product_categories USING btree (id);

CREATE UNIQUE INDEX product_movements_pkey ON public.product_movements USING btree (id);

CREATE UNIQUE INDEX product_units_pkey ON public.product_units USING btree (id);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX products_sku_key ON public.products USING btree (sku);

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX record_items_pkey ON public.record_items USING btree (id);

CREATE UNIQUE INDEX roles_pkey ON public.roles USING btree (id);

CREATE UNIQUE INDEX specialties_pkey ON public.specialties USING btree (id);

CREATE UNIQUE INDEX species_pkey ON public.species USING btree (id);

CREATE UNIQUE INDEX species_tenant_id_name_key ON public.species USING btree (tenant_id, name);

CREATE UNIQUE INDEX staff_pkey ON public.staff USING btree (id);

CREATE UNIQUE INDEX staff_specialties_pkey ON public.staff_specialties USING btree (id);

CREATE UNIQUE INDEX staff_specialties_tenant_id_staff_id_specialty_id_key ON public.staff_specialties USING btree (tenant_id, staff_id, specialty_id);

CREATE UNIQUE INDEX staff_tenant_id_user_id_key ON public.staff USING btree (tenant_id, user_id);

CREATE UNIQUE INDEX supplier_brands_pkey ON public.supplier_brands USING btree (id);

CREATE UNIQUE INDEX suppliers_pkey ON public.suppliers USING btree (id);

CREATE UNIQUE INDEX surgeries_pkey ON public.surgeries USING btree (id);

CREATE UNIQUE INDEX tenant_counters_pkey ON public.tenant_counters USING btree (tenant_id, counter_key);

CREATE UNIQUE INDEX tenant_users_pkey ON public.tenant_users USING btree (tenant_id, user_id);

CREATE INDEX tenants_name_idx ON public.tenants USING btree (lower(name));

CREATE UNIQUE INDEX tenants_pkey ON public.tenants USING btree (id);

CREATE UNIQUE INDEX tenants_subdomain_unique_idx ON public.tenants USING btree (lower(subdomain)) WHERE (subdomain IS NOT NULL);

CREATE UNIQUE INDEX trainings_pkey ON public.trainings USING btree (id);

CREATE UNIQUE INDEX uq_prodbrand_tenant_name ON public.product_brands USING btree (tenant_id, name);

CREATE UNIQUE INDEX uq_prodcat_tenant_name ON public.product_categories USING btree (tenant_id, name);

CREATE UNIQUE INDEX uq_produnit_tenant_name ON public.product_units USING btree (tenant_id, name);

CREATE UNIQUE INDEX uq_supplier_brand_per_tenant ON public.supplier_brands USING btree (tenant_id, supplier_id, brand_id);

CREATE UNIQUE INDEX uq_suppliers_tenant_name ON public.suppliers USING btree (tenant_id, name);

CREATE UNIQUE INDEX vaccinations_pkey ON public.vaccinations USING btree (id);

alter table "public"."appointment_types" add constraint "appointment_types_pkey" PRIMARY KEY using index "appointment_types_pkey";

alter table "public"."appointments" add constraint "appointments_pkey" PRIMARY KEY using index "appointments_pkey";

alter table "public"."boardings" add constraint "boardings_pkey" PRIMARY KEY using index "boardings_pkey";

alter table "public"."breeds" add constraint "breeds_pkey" PRIMARY KEY using index "breeds_pkey";

alter table "public"."clinical_notes" add constraint "clinical_notes_pkey" PRIMARY KEY using index "clinical_notes_pkey";

alter table "public"."clinical_parameters" add constraint "clinical_parameters_pkey" PRIMARY KEY using index "clinical_parameters_pkey";

alter table "public"."clinical_records" add constraint "clinical_records_pkey" PRIMARY KEY using index "clinical_records_pkey";

alter table "public"."customers" add constraint "clients_pkey" PRIMARY KEY using index "clients_pkey";

alter table "public"."hospitalizations" add constraint "hospitalizations_pkey" PRIMARY KEY using index "hospitalizations_pkey";

alter table "public"."invitations" add constraint "invitations_pkey" PRIMARY KEY using index "invitations_pkey";

alter table "public"."order_items" add constraint "order_items_pkey" PRIMARY KEY using index "order_items_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."otps" add constraint "otps_pkey" PRIMARY KEY using index "otps_pkey";

alter table "public"."payment_methods" add constraint "payment_methods_pkey" PRIMARY KEY using index "payment_methods_pkey";

alter table "public"."payments" add constraint "payments_pkey" PRIMARY KEY using index "payments_pkey";

alter table "public"."pets" add constraint "pets_pkey" PRIMARY KEY using index "pets_pkey";

alter table "public"."product_brands" add constraint "product_brands_pkey" PRIMARY KEY using index "product_brands_pkey";

alter table "public"."product_categories" add constraint "product_categories_pkey" PRIMARY KEY using index "product_categories_pkey";

alter table "public"."product_movements" add constraint "product_movements_pkey" PRIMARY KEY using index "product_movements_pkey";

alter table "public"."product_units" add constraint "product_units_pkey" PRIMARY KEY using index "product_units_pkey";

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."record_items" add constraint "record_items_pkey" PRIMARY KEY using index "record_items_pkey";

alter table "public"."roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "public"."specialties" add constraint "specialties_pkey" PRIMARY KEY using index "specialties_pkey";

alter table "public"."species" add constraint "species_pkey" PRIMARY KEY using index "species_pkey";

alter table "public"."staff" add constraint "staff_pkey" PRIMARY KEY using index "staff_pkey";

alter table "public"."staff_specialties" add constraint "staff_specialties_pkey" PRIMARY KEY using index "staff_specialties_pkey";

alter table "public"."supplier_brands" add constraint "supplier_brands_pkey" PRIMARY KEY using index "supplier_brands_pkey";

alter table "public"."suppliers" add constraint "suppliers_pkey" PRIMARY KEY using index "suppliers_pkey";

alter table "public"."surgeries" add constraint "surgeries_pkey" PRIMARY KEY using index "surgeries_pkey";

alter table "public"."tenant_counters" add constraint "tenant_counters_pkey" PRIMARY KEY using index "tenant_counters_pkey";

alter table "public"."tenant_users" add constraint "tenant_users_pkey" PRIMARY KEY using index "tenant_users_pkey";

alter table "public"."tenants" add constraint "tenants_pkey" PRIMARY KEY using index "tenants_pkey";

alter table "public"."trainings" add constraint "trainings_pkey" PRIMARY KEY using index "trainings_pkey";

alter table "public"."vaccinations" add constraint "vaccinations_pkey" PRIMARY KEY using index "vaccinations_pkey";

alter table "public"."appointment_types" add constraint "appointment_types_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."appointment_types" validate constraint "appointment_types_created_by_fkey";

alter table "public"."appointment_types" add constraint "appointment_types_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."appointment_types" validate constraint "appointment_types_tenant_id_fkey";

alter table "public"."appointment_types" add constraint "appointment_types_tenant_id_name_key" UNIQUE using index "appointment_types_tenant_id_name_key";

alter table "public"."appointment_types" add constraint "appointment_types_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."appointment_types" validate constraint "appointment_types_updated_by_fkey";

alter table "public"."appointments" add constraint "appointments_appointment_type_id_fkey" FOREIGN KEY (appointment_type_id) REFERENCES public.appointment_types(id) ON DELETE RESTRICT not valid;

alter table "public"."appointments" validate constraint "appointments_appointment_type_id_fkey";

alter table "public"."appointments" add constraint "appointments_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."appointments" validate constraint "appointments_created_by_fkey";

alter table "public"."appointments" add constraint "appointments_pet_id_fkey" FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE not valid;

alter table "public"."appointments" validate constraint "appointments_pet_id_fkey";

alter table "public"."appointments" add constraint "appointments_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."appointments" validate constraint "appointments_tenant_id_fkey";

alter table "public"."appointments" add constraint "appointments_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."appointments" validate constraint "appointments_updated_by_fkey";

alter table "public"."appointments" add constraint "appointments_veterinarian_id_fkey" FOREIGN KEY (veterinarian_id) REFERENCES public.staff(id) ON DELETE SET NULL not valid;

alter table "public"."appointments" validate constraint "appointments_veterinarian_id_fkey";

alter table "public"."boardings" add constraint "boardings_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."boardings" validate constraint "boardings_tenant_id_fkey";

alter table "public"."breeds" add constraint "breeds_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."breeds" validate constraint "breeds_created_by_fkey";

alter table "public"."breeds" add constraint "breeds_species_id_fkey" FOREIGN KEY (species_id) REFERENCES public.species(id) ON DELETE RESTRICT not valid;

alter table "public"."breeds" validate constraint "breeds_species_id_fkey";

alter table "public"."breeds" add constraint "breeds_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."breeds" validate constraint "breeds_tenant_id_fkey";

alter table "public"."breeds" add constraint "breeds_tenant_id_species_id_name_key" UNIQUE using index "breeds_tenant_id_species_id_name_key";

alter table "public"."breeds" add constraint "breeds_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."breeds" validate constraint "breeds_updated_by_fkey";

alter table "public"."clinical_notes" add constraint "clinical_notes_clinical_record_id_fkey" FOREIGN KEY (clinical_record_id) REFERENCES public.clinical_records(id) not valid;

alter table "public"."clinical_notes" validate constraint "clinical_notes_clinical_record_id_fkey";

alter table "public"."clinical_notes" add constraint "clinical_notes_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."clinical_notes" validate constraint "clinical_notes_created_by_fkey";

alter table "public"."clinical_notes" add constraint "clinical_notes_pet_id_fkey" FOREIGN KEY (pet_id) REFERENCES public.pets(id) not valid;

alter table "public"."clinical_notes" validate constraint "clinical_notes_pet_id_fkey";

alter table "public"."clinical_notes" add constraint "clinical_notes_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."clinical_notes" validate constraint "clinical_notes_tenant_id_fkey";

alter table "public"."clinical_notes" add constraint "clinical_notes_vet_id_fkey" FOREIGN KEY (vet_id) REFERENCES public.staff(id) not valid;

alter table "public"."clinical_notes" validate constraint "clinical_notes_vet_id_fkey";

alter table "public"."clinical_parameters" add constraint "clinical_parameters_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."clinical_parameters" validate constraint "clinical_parameters_created_by_fkey";

alter table "public"."clinical_parameters" add constraint "clinical_parameters_params_check" CHECK ((jsonb_typeof(params) = 'object'::text)) not valid;

alter table "public"."clinical_parameters" validate constraint "clinical_parameters_params_check";

alter table "public"."clinical_parameters" add constraint "clinical_parameters_pet_id_fkey" FOREIGN KEY (pet_id) REFERENCES public.pets(id) not valid;

alter table "public"."clinical_parameters" validate constraint "clinical_parameters_pet_id_fkey";

alter table "public"."clinical_parameters" add constraint "clinical_parameters_record_id_fkey" FOREIGN KEY (clinical_record_id) REFERENCES public.clinical_records(id) not valid;

alter table "public"."clinical_parameters" validate constraint "clinical_parameters_record_id_fkey";

alter table "public"."clinical_parameters" add constraint "clinical_parameters_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."clinical_parameters" validate constraint "clinical_parameters_tenant_id_fkey";

alter table "public"."clinical_parameters" add constraint "clinical_parameters_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."clinical_parameters" validate constraint "clinical_parameters_updated_by_fkey";

alter table "public"."clinical_records" add constraint "clinical_records_appointment_id_fkey" FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE SET NULL not valid;

alter table "public"."clinical_records" validate constraint "clinical_records_appointment_id_fkey";

alter table "public"."clinical_records" add constraint "clinical_records_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."clinical_records" validate constraint "clinical_records_created_by_fkey";

alter table "public"."clinical_records" add constraint "clinical_records_pet_id_fkey" FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE RESTRICT not valid;

alter table "public"."clinical_records" validate constraint "clinical_records_pet_id_fkey";

alter table "public"."clinical_records" add constraint "clinical_records_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."clinical_records" validate constraint "clinical_records_tenant_id_fkey";

alter table "public"."clinical_records" add constraint "clinical_records_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."clinical_records" validate constraint "clinical_records_updated_by_fkey";

alter table "public"."clinical_records" add constraint "clinical_records_vet_id_fkey" FOREIGN KEY (vet_id) REFERENCES public.staff(id) ON DELETE SET NULL not valid;

alter table "public"."clinical_records" validate constraint "clinical_records_vet_id_fkey";

alter table "public"."customers" add constraint "clients_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."customers" validate constraint "clients_created_by_fkey";

alter table "public"."customers" add constraint "clients_tenant_id_document_number_key" UNIQUE using index "clients_tenant_id_document_number_key";

alter table "public"."customers" add constraint "clients_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."customers" validate constraint "clients_tenant_id_fkey";

alter table "public"."customers" add constraint "clients_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."customers" validate constraint "clients_updated_by_fkey";

alter table "public"."hospitalizations" add constraint "hospitalizations_pet_id_fkey" FOREIGN KEY (pet_id) REFERENCES public.pets(id) not valid;

alter table "public"."hospitalizations" validate constraint "hospitalizations_pet_id_fkey";

alter table "public"."hospitalizations" add constraint "hospitalizations_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."hospitalizations" validate constraint "hospitalizations_tenant_id_fkey";

alter table "public"."invitations" add constraint "invitations_email_lowercase" CHECK ((email = lower(email))) not valid;

alter table "public"."invitations" validate constraint "invitations_email_lowercase";

alter table "public"."invitations" add constraint "invitations_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.roles(id) not valid;

alter table "public"."invitations" validate constraint "invitations_role_id_fkey";

alter table "public"."invitations" add constraint "invitations_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."invitations" validate constraint "invitations_tenant_id_fkey";

alter table "public"."order_items" add constraint "order_items_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE not valid;

alter table "public"."order_items" validate constraint "order_items_order_id_fkey";

alter table "public"."order_items" add constraint "order_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) not valid;

alter table "public"."order_items" validate constraint "order_items_product_id_fkey";

alter table "public"."order_items" add constraint "order_items_quantity_check" CHECK ((quantity > (0)::numeric)) not valid;

alter table "public"."order_items" validate constraint "order_items_quantity_check";

alter table "public"."order_items" add constraint "order_items_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."order_items" validate constraint "order_items_tenant_id_fkey";

alter table "public"."orders" add constraint "orders_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."orders" validate constraint "orders_created_by_fkey";

alter table "public"."orders" add constraint "orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."orders" validate constraint "orders_customer_id_fkey";

alter table "public"."orders" add constraint "orders_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."orders" validate constraint "orders_tenant_id_fkey";

alter table "public"."orders" add constraint "orders_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.profiles(id) not valid;

alter table "public"."orders" validate constraint "orders_updated_by_fkey";

alter table "public"."otps" add constraint "otps_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."otps" validate constraint "otps_created_by_fkey";

alter table "public"."otps" add constraint "otps_tenant_email_code_unique" UNIQUE using index "otps_tenant_email_code_unique";

alter table "public"."otps" add constraint "otps_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."otps" validate constraint "otps_tenant_id_fkey";

alter table "public"."payment_methods" add constraint "payment_methods_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."payment_methods" validate constraint "payment_methods_created_by_fkey";

alter table "public"."payment_methods" add constraint "payment_methods_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."payment_methods" validate constraint "payment_methods_tenant_id_fkey";

alter table "public"."payment_methods" add constraint "payment_methods_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.profiles(id) not valid;

alter table "public"."payment_methods" validate constraint "payment_methods_updated_by_fkey";

alter table "public"."payments" add constraint "payments_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."payments" validate constraint "payments_created_by_fkey";

alter table "public"."payments" add constraint "payments_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;

alter table "public"."payments" validate constraint "payments_customer_id_fkey";

alter table "public"."payments" add constraint "payments_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) not valid;

alter table "public"."payments" validate constraint "payments_order_id_fkey";

alter table "public"."payments" add constraint "payments_payment_method_id_fkey" FOREIGN KEY (payment_method_id) REFERENCES public.payment_methods(id) not valid;

alter table "public"."payments" validate constraint "payments_payment_method_id_fkey";

alter table "public"."payments" add constraint "payments_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."payments" validate constraint "payments_tenant_id_fkey";

alter table "public"."payments" add constraint "payments_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.profiles(id) not valid;

alter table "public"."payments" validate constraint "payments_updated_by_fkey";

alter table "public"."pets" add constraint "pets_breed_id_fkey" FOREIGN KEY (breed_id) REFERENCES public.breeds(id) not valid;

alter table "public"."pets" validate constraint "pets_breed_id_fkey";

alter table "public"."pets" add constraint "pets_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."pets" validate constraint "pets_created_by_fkey";

alter table "public"."pets" add constraint "pets_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE not valid;

alter table "public"."pets" validate constraint "pets_customer_id_fkey";

alter table "public"."pets" add constraint "pets_species_id_fkey" FOREIGN KEY (species_id) REFERENCES public.species(id) not valid;

alter table "public"."pets" validate constraint "pets_species_id_fkey";

alter table "public"."pets" add constraint "pets_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."pets" validate constraint "pets_tenant_id_fkey";

alter table "public"."pets" add constraint "pets_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."pets" validate constraint "pets_updated_by_fkey";

alter table "public"."product_brands" add constraint "product_brands_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."product_brands" validate constraint "product_brands_tenant_id_fkey";

alter table "public"."product_brands" add constraint "uq_prodbrand_tenant_name" UNIQUE using index "uq_prodbrand_tenant_name";

alter table "public"."product_categories" add constraint "product_categories_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."product_categories" validate constraint "product_categories_tenant_id_fkey";

alter table "public"."product_categories" add constraint "uq_prodcat_tenant_name" UNIQUE using index "uq_prodcat_tenant_name";

alter table "public"."product_movements" add constraint "product_movements_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."product_movements" validate constraint "product_movements_product_id_fkey";

alter table "public"."product_movements" add constraint "product_movements_quantity_check" CHECK ((quantity > (0)::numeric)) not valid;

alter table "public"."product_movements" validate constraint "product_movements_quantity_check";

alter table "public"."product_movements" add constraint "product_movements_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."product_movements" validate constraint "product_movements_tenant_id_fkey";

alter table "public"."product_units" add constraint "product_units_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."product_units" validate constraint "product_units_tenant_id_fkey";

alter table "public"."product_units" add constraint "uq_produnit_tenant_name" UNIQUE using index "uq_produnit_tenant_name";

alter table "public"."products" add constraint "products_brand_id_fkey" FOREIGN KEY (brand_id) REFERENCES public.product_brands(id) not valid;

alter table "public"."products" validate constraint "products_brand_id_fkey";

alter table "public"."products" add constraint "products_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.product_categories(id) not valid;

alter table "public"."products" validate constraint "products_category_id_fkey";

alter table "public"."products" add constraint "products_sku_key" UNIQUE using index "products_sku_key";

alter table "public"."products" add constraint "products_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."products" validate constraint "products_tenant_id_fkey";

alter table "public"."products" add constraint "products_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES public.product_units(id) not valid;

alter table "public"."products" validate constraint "products_unit_id_fkey";

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."record_items" add constraint "record_items_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."record_items" validate constraint "record_items_created_by_fkey";

alter table "public"."record_items" add constraint "record_items_discount_check" CHECK ((discount >= (0)::numeric)) not valid;

alter table "public"."record_items" validate constraint "record_items_discount_check";

alter table "public"."record_items" add constraint "record_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT not valid;

alter table "public"."record_items" validate constraint "record_items_product_id_fkey";

alter table "public"."record_items" add constraint "record_items_qty_check" CHECK ((qty > (0)::numeric)) not valid;

alter table "public"."record_items" validate constraint "record_items_qty_check";

alter table "public"."record_items" add constraint "record_items_record_id_fkey" FOREIGN KEY (record_id) REFERENCES public.clinical_records(id) ON DELETE CASCADE not valid;

alter table "public"."record_items" validate constraint "record_items_record_id_fkey";

alter table "public"."record_items" add constraint "record_items_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."record_items" validate constraint "record_items_tenant_id_fkey";

alter table "public"."record_items" add constraint "record_items_unit_price_check" CHECK ((unit_price >= (0)::numeric)) not valid;

alter table "public"."record_items" validate constraint "record_items_unit_price_check";

alter table "public"."roles" add constraint "roles_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."roles" validate constraint "roles_tenant_id_fkey";

alter table "public"."specialties" add constraint "specialties_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."specialties" validate constraint "specialties_created_by_fkey";

alter table "public"."specialties" add constraint "specialties_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."specialties" validate constraint "specialties_tenant_id_fkey";

alter table "public"."specialties" add constraint "specialties_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."specialties" validate constraint "specialties_updated_by_fkey";

alter table "public"."species" add constraint "species_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."species" validate constraint "species_created_by_fkey";

alter table "public"."species" add constraint "species_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."species" validate constraint "species_tenant_id_fkey";

alter table "public"."species" add constraint "species_tenant_id_name_key" UNIQUE using index "species_tenant_id_name_key";

alter table "public"."species" add constraint "species_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."species" validate constraint "species_updated_by_fkey";

alter table "public"."staff" add constraint "staff_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."staff" validate constraint "staff_created_by_fkey";

alter table "public"."staff" add constraint "staff_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."staff" validate constraint "staff_tenant_id_fkey";

alter table "public"."staff" add constraint "staff_tenant_id_user_id_key" UNIQUE using index "staff_tenant_id_user_id_key";

alter table "public"."staff" add constraint "staff_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."staff" validate constraint "staff_updated_by_fkey";

alter table "public"."staff" add constraint "staff_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."staff" validate constraint "staff_user_id_fkey";

alter table "public"."staff_specialties" add constraint "staff_specialties_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."staff_specialties" validate constraint "staff_specialties_created_by_fkey";

alter table "public"."staff_specialties" add constraint "staff_specialties_specialty_id_fkey" FOREIGN KEY (specialty_id) REFERENCES public.specialties(id) ON DELETE CASCADE not valid;

alter table "public"."staff_specialties" validate constraint "staff_specialties_specialty_id_fkey";

alter table "public"."staff_specialties" add constraint "staff_specialties_staff_id_fkey" FOREIGN KEY (staff_id) REFERENCES public.staff(id) ON DELETE CASCADE not valid;

alter table "public"."staff_specialties" validate constraint "staff_specialties_staff_id_fkey";

alter table "public"."staff_specialties" add constraint "staff_specialties_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."staff_specialties" validate constraint "staff_specialties_tenant_id_fkey";

alter table "public"."staff_specialties" add constraint "staff_specialties_tenant_id_staff_id_specialty_id_key" UNIQUE using index "staff_specialties_tenant_id_staff_id_specialty_id_key";

alter table "public"."supplier_brands" add constraint "supplier_brands_brand_id_fkey" FOREIGN KEY (brand_id) REFERENCES public.product_brands(id) ON DELETE CASCADE not valid;

alter table "public"."supplier_brands" validate constraint "supplier_brands_brand_id_fkey";

alter table "public"."supplier_brands" add constraint "supplier_brands_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE CASCADE not valid;

alter table "public"."supplier_brands" validate constraint "supplier_brands_supplier_id_fkey";

alter table "public"."supplier_brands" add constraint "supplier_brands_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."supplier_brands" validate constraint "supplier_brands_tenant_id_fkey";

alter table "public"."supplier_brands" add constraint "uq_supplier_brand_per_tenant" UNIQUE using index "uq_supplier_brand_per_tenant";

alter table "public"."suppliers" add constraint "suppliers_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."suppliers" validate constraint "suppliers_tenant_id_fkey";

alter table "public"."suppliers" add constraint "uq_suppliers_tenant_name" UNIQUE using index "uq_suppliers_tenant_name";

alter table "public"."surgeries" add constraint "surgeries_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."surgeries" validate constraint "surgeries_tenant_id_fkey";

alter table "public"."tenant_counters" add constraint "tenant_counters_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."tenant_counters" validate constraint "tenant_counters_tenant_id_fkey";

alter table "public"."tenant_users" add constraint "tenant_users_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.roles(id) not valid;

alter table "public"."tenant_users" validate constraint "tenant_users_role_id_fkey";

alter table "public"."tenant_users" add constraint "tenant_users_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tenant_users" validate constraint "tenant_users_tenant_id_fkey";

alter table "public"."tenant_users" add constraint "tenant_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) not valid;

alter table "public"."tenant_users" validate constraint "tenant_users_user_id_fkey";

alter table "public"."tenants" add constraint "tenants_subdomain_chk" CHECK (((subdomain IS NULL) OR (((length(subdomain) >= 3) AND (length(subdomain) <= 63)) AND (subdomain ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])?$'::text)))) not valid;

alter table "public"."tenants" validate constraint "tenants_subdomain_chk";

alter table "public"."trainings" add constraint "trainings_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."trainings" validate constraint "trainings_tenant_id_fkey";

alter table "public"."trainings" add constraint "trainings_trainer_id_fkey" FOREIGN KEY (trainer_id) REFERENCES public.staff(id) ON DELETE SET NULL not valid;

alter table "public"."trainings" validate constraint "trainings_trainer_id_fkey";

alter table "public"."vaccinations" add constraint "vaccinations_clinical_record_id_fkey" FOREIGN KEY (clinical_record_id) REFERENCES public.clinical_records(id) not valid;

alter table "public"."vaccinations" validate constraint "vaccinations_clinical_record_id_fkey";

alter table "public"."vaccinations" add constraint "vaccinations_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."vaccinations" validate constraint "vaccinations_created_by_fkey";

alter table "public"."vaccinations" add constraint "vaccinations_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."vaccinations" validate constraint "vaccinations_tenant_id_fkey";

alter table "public"."vaccinations" add constraint "vaccinations_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES auth.users(id) not valid;

alter table "public"."vaccinations" validate constraint "vaccinations_updated_by_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_triggers_for_all_tables()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  r record;
  trigger_name text := 'trg_set_updated_metadata';
begin
  for r in
    select table_schema, table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_type = 'BASE TABLE'
  loop
    execute format('
      drop trigger if exists %I on %I.%I;
      create trigger %I
      before update on %I.%I
      for each row
      execute procedure public.set_updated_metadata();
    ', trigger_name, r.table_schema, r.table_name,
       trigger_name, r.table_schema, r.table_name);
  end loop;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.ensure_owner_membership()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$begin
  insert into public.tenant_users (tenant_id, user_id,  created_by, updated_by)
  values (
    new.id,
    new.owner_id,
    coalesce(auth.uid(), new.owner_id),
    coalesce(auth.uid(), new.owner_id)
  )
  on conflict (tenant_id, user_id) do nothing;

  return new;
end;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  return new;
end;$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_metadata()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  -- Verificar si existe la columna updated_at
  if exists (
    select 1
    from information_schema.columns
    where table_schema = tg_table_schema
      and table_name = tg_table_name
      and column_name = 'updated_at'
  ) then
    new.updated_at := now();
  end if;

  -- Verificar si existe la columna updated_by
  if exists (
    select 1
    from information_schema.columns
    where table_schema = tg_table_schema
      and table_name = tg_table_name
      and column_name = 'updated_by'
  ) then
    if new.updated_by is null then
      new.updated_by := auth.uid();
    end if;
  end if;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_generate_tenant_counter()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  next_number integer;
  pad_len     int := 6;
  target_col  text := TG_ARGV[2];
  doc_value   text;
begin
  if array_length(TG_ARGV,1) >= 4 then
    pad_len := nullif(TG_ARGV[3],'')::int;
  end if;

  -- 1) Incremento atómico del contador por tenant + clave
  insert into tenant_counters (tenant_id, counter_key, last_number)
  values (NEW.tenant_id, TG_ARGV[0], 1)
  on conflict (tenant_id, counter_key)
  do update set last_number = tenant_counters.last_number + 1,
                updated_at  = now()
  returning tenant_counters.last_number into next_number;

  -- 2) Construcción del valor final (p.ej. ORD-000001)
  doc_value := TG_ARGV[1] || '-' || lpad(next_number::text, pad_len, '0');

  -- 3) UPDATE dinámico a la fila recién insertada (identificada por CTID)
  execute format(
    'update %I set %I = $1 where ctid = $2',
    TG_TABLE_NAME, target_col
  )
  using doc_value, NEW.ctid;

  return NEW;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_movements_update_stock()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_prod_id   uuid;
  v_is_service boolean := false;
BEGIN
  -- 🔒 Bloquear cambio de producto dentro del mismo trigger
  IF TG_OP = 'UPDATE' AND NEW.product_id <> OLD.product_id THEN
    RAISE EXCEPTION 'No se permite cambiar product_id en product_movements';
  END IF;

  -- 📦 Colapsar referencias según el evento
  v_prod_id   := COALESCE(NEW.product_id, OLD.product_id);

  -- 🏷️ Detectar si es servicio (si lo es, no se modifica stock)
  SELECT COALESCE(is_service, false)
    INTO v_is_service
    FROM public.products
   WHERE id = v_prod_id;

  IF v_is_service THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    ELSE
      RETURN NEW;
    END IF;
  END IF;

  -- 📈 Reglas de stock por signo de quantity
  IF TG_OP = 'INSERT' THEN
    UPDATE public.products p
       SET stock = p.stock - NEW.quantity
     WHERE p.id = NEW.product_id;
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.products p
       SET stock = p.stock + OLD.quantity
     WHERE p.id = OLD.product_id;
    RETURN OLD;

  ELSIF TG_OP = 'UPDATE' THEN
    -- Mismo product_id garantizado por el bloqueo anterior
    UPDATE public.products p
       SET stock = p.stock + OLD.quantity - NEW.quantity
     WHERE p.id = NEW.product_id;
    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_order_recalc_totals()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE v_order_id uuid;
BEGIN
  v_order_id := COALESCE(NEW.order_id, OLD.order_id);

  UPDATE orders o
  SET total = COALESCE((
               SELECT SUM(total)
               FROM order_items
               WHERE order_id = v_order_id
             ), 0)
  WHERE o.id = v_order_id;

  RETURN COALESCE(NEW, OLD);
END$function$
;

CREATE OR REPLACE FUNCTION public.trg_payments_recalc_order()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_order_id uuid;
  v_paid     numeric;
begin
  -- AFTER trigger: toma la orden afectada según esté NEW u OLD
  v_order_id := coalesce(new.order_id, old.order_id);

  if v_order_id is null then
    return null;
  end if;

  -- Suma actual de pagos de esa orden (estado final post operación)
  select coalesce(sum(amount), 0)
    into v_paid
    from public.payments
   where order_id = v_order_id;

  -- Actualiza solo paid_amount (y timestamp para trazabilidad)
  update public.orders
     set paid_amount = v_paid,
         updated_at  = now()
   where id = v_order_id;

  return null;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_payments_recalc_paid()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_order_id uuid;
BEGIN
  v_order_id := COALESCE(NEW.order_id, OLD.order_id);

  UPDATE orders o
  SET paid_amount = COALESCE((
                  SELECT SUM(p.amount)
                  FROM payments p
                  WHERE p.order_id = v_order_id
                ), 0)
  WHERE o.id = v_order_id;

  RETURN COALESCE(NEW, OLD);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_payments_set_customer()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Solo en INSERT o cuando cambia el order_id
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.order_id IS DISTINCT FROM OLD.order_id) THEN
    -- Traer el customer_id de la orden
    SELECT o.customer_id
      INTO NEW.customer_id
    FROM orders o
    WHERE o.id = NEW.order_id;

    -- (Opcional pero recomendado) exigir que la orden exista
    /*IF NEW.customer_id IS NULL THEN
      RAISE EXCEPTION 'payments.customer_id no pudo obtenerse: order % no existe o no tiene customer_id', NEW.order_id;
    END IF;*/
  END IF;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trg_products_initial_stock()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_initial numeric(14,3) := coalesce(NEW.stock, 0);
begin
  if NEW.is_service or v_initial <= 0 then
    return NEW;
  end if;

  -- Crear movimiento ya con el producto persistido
  insert into public.product_movements (
    tenant_id, product_id, quantity, unit_cost, reference, note
  )
  values (
    NEW.tenant_id, NEW.id, v_initial, coalesce(NEW.cost, 0),
    'initial_stock', 'Generado automáticamente al crear producto con stock inicial'
  );

  -- Normaliza stock del producto (requiere UPDATE porque es AFTER)
  update public.products
     set stock = 0,
         updated_at = now(),
         updated_by = coalesce(auth.uid(), NEW.created_by)
   where id = NEW.id and tenant_id = NEW.tenant_id;

  return NEW;
end;
$function$
;

grant delete on table "public"."appointment_types" to "anon";

grant insert on table "public"."appointment_types" to "anon";

grant references on table "public"."appointment_types" to "anon";

grant select on table "public"."appointment_types" to "anon";

grant trigger on table "public"."appointment_types" to "anon";

grant truncate on table "public"."appointment_types" to "anon";

grant update on table "public"."appointment_types" to "anon";

grant delete on table "public"."appointment_types" to "authenticated";

grant insert on table "public"."appointment_types" to "authenticated";

grant references on table "public"."appointment_types" to "authenticated";

grant select on table "public"."appointment_types" to "authenticated";

grant trigger on table "public"."appointment_types" to "authenticated";

grant truncate on table "public"."appointment_types" to "authenticated";

grant update on table "public"."appointment_types" to "authenticated";

grant delete on table "public"."appointment_types" to "service_role";

grant insert on table "public"."appointment_types" to "service_role";

grant references on table "public"."appointment_types" to "service_role";

grant select on table "public"."appointment_types" to "service_role";

grant trigger on table "public"."appointment_types" to "service_role";

grant truncate on table "public"."appointment_types" to "service_role";

grant update on table "public"."appointment_types" to "service_role";

grant delete on table "public"."appointments" to "anon";

grant insert on table "public"."appointments" to "anon";

grant references on table "public"."appointments" to "anon";

grant select on table "public"."appointments" to "anon";

grant trigger on table "public"."appointments" to "anon";

grant truncate on table "public"."appointments" to "anon";

grant update on table "public"."appointments" to "anon";

grant delete on table "public"."appointments" to "authenticated";

grant insert on table "public"."appointments" to "authenticated";

grant references on table "public"."appointments" to "authenticated";

grant select on table "public"."appointments" to "authenticated";

grant trigger on table "public"."appointments" to "authenticated";

grant truncate on table "public"."appointments" to "authenticated";

grant update on table "public"."appointments" to "authenticated";

grant delete on table "public"."appointments" to "service_role";

grant insert on table "public"."appointments" to "service_role";

grant references on table "public"."appointments" to "service_role";

grant select on table "public"."appointments" to "service_role";

grant trigger on table "public"."appointments" to "service_role";

grant truncate on table "public"."appointments" to "service_role";

grant update on table "public"."appointments" to "service_role";

grant delete on table "public"."boardings" to "anon";

grant insert on table "public"."boardings" to "anon";

grant references on table "public"."boardings" to "anon";

grant select on table "public"."boardings" to "anon";

grant trigger on table "public"."boardings" to "anon";

grant truncate on table "public"."boardings" to "anon";

grant update on table "public"."boardings" to "anon";

grant delete on table "public"."boardings" to "authenticated";

grant insert on table "public"."boardings" to "authenticated";

grant references on table "public"."boardings" to "authenticated";

grant select on table "public"."boardings" to "authenticated";

grant trigger on table "public"."boardings" to "authenticated";

grant truncate on table "public"."boardings" to "authenticated";

grant update on table "public"."boardings" to "authenticated";

grant delete on table "public"."boardings" to "service_role";

grant insert on table "public"."boardings" to "service_role";

grant references on table "public"."boardings" to "service_role";

grant select on table "public"."boardings" to "service_role";

grant trigger on table "public"."boardings" to "service_role";

grant truncate on table "public"."boardings" to "service_role";

grant update on table "public"."boardings" to "service_role";

grant delete on table "public"."breeds" to "anon";

grant insert on table "public"."breeds" to "anon";

grant references on table "public"."breeds" to "anon";

grant select on table "public"."breeds" to "anon";

grant trigger on table "public"."breeds" to "anon";

grant truncate on table "public"."breeds" to "anon";

grant update on table "public"."breeds" to "anon";

grant delete on table "public"."breeds" to "authenticated";

grant insert on table "public"."breeds" to "authenticated";

grant references on table "public"."breeds" to "authenticated";

grant select on table "public"."breeds" to "authenticated";

grant trigger on table "public"."breeds" to "authenticated";

grant truncate on table "public"."breeds" to "authenticated";

grant update on table "public"."breeds" to "authenticated";

grant delete on table "public"."breeds" to "service_role";

grant insert on table "public"."breeds" to "service_role";

grant references on table "public"."breeds" to "service_role";

grant select on table "public"."breeds" to "service_role";

grant trigger on table "public"."breeds" to "service_role";

grant truncate on table "public"."breeds" to "service_role";

grant update on table "public"."breeds" to "service_role";

grant delete on table "public"."clinical_notes" to "anon";

grant insert on table "public"."clinical_notes" to "anon";

grant references on table "public"."clinical_notes" to "anon";

grant select on table "public"."clinical_notes" to "anon";

grant trigger on table "public"."clinical_notes" to "anon";

grant truncate on table "public"."clinical_notes" to "anon";

grant update on table "public"."clinical_notes" to "anon";

grant delete on table "public"."clinical_notes" to "authenticated";

grant insert on table "public"."clinical_notes" to "authenticated";

grant references on table "public"."clinical_notes" to "authenticated";

grant select on table "public"."clinical_notes" to "authenticated";

grant trigger on table "public"."clinical_notes" to "authenticated";

grant truncate on table "public"."clinical_notes" to "authenticated";

grant update on table "public"."clinical_notes" to "authenticated";

grant delete on table "public"."clinical_notes" to "service_role";

grant insert on table "public"."clinical_notes" to "service_role";

grant references on table "public"."clinical_notes" to "service_role";

grant select on table "public"."clinical_notes" to "service_role";

grant trigger on table "public"."clinical_notes" to "service_role";

grant truncate on table "public"."clinical_notes" to "service_role";

grant update on table "public"."clinical_notes" to "service_role";

grant delete on table "public"."clinical_parameters" to "anon";

grant insert on table "public"."clinical_parameters" to "anon";

grant references on table "public"."clinical_parameters" to "anon";

grant select on table "public"."clinical_parameters" to "anon";

grant trigger on table "public"."clinical_parameters" to "anon";

grant truncate on table "public"."clinical_parameters" to "anon";

grant update on table "public"."clinical_parameters" to "anon";

grant delete on table "public"."clinical_parameters" to "authenticated";

grant insert on table "public"."clinical_parameters" to "authenticated";

grant references on table "public"."clinical_parameters" to "authenticated";

grant select on table "public"."clinical_parameters" to "authenticated";

grant trigger on table "public"."clinical_parameters" to "authenticated";

grant truncate on table "public"."clinical_parameters" to "authenticated";

grant update on table "public"."clinical_parameters" to "authenticated";

grant delete on table "public"."clinical_parameters" to "service_role";

grant insert on table "public"."clinical_parameters" to "service_role";

grant references on table "public"."clinical_parameters" to "service_role";

grant select on table "public"."clinical_parameters" to "service_role";

grant trigger on table "public"."clinical_parameters" to "service_role";

grant truncate on table "public"."clinical_parameters" to "service_role";

grant update on table "public"."clinical_parameters" to "service_role";

grant delete on table "public"."clinical_records" to "anon";

grant insert on table "public"."clinical_records" to "anon";

grant references on table "public"."clinical_records" to "anon";

grant select on table "public"."clinical_records" to "anon";

grant trigger on table "public"."clinical_records" to "anon";

grant truncate on table "public"."clinical_records" to "anon";

grant update on table "public"."clinical_records" to "anon";

grant delete on table "public"."clinical_records" to "authenticated";

grant insert on table "public"."clinical_records" to "authenticated";

grant references on table "public"."clinical_records" to "authenticated";

grant select on table "public"."clinical_records" to "authenticated";

grant trigger on table "public"."clinical_records" to "authenticated";

grant truncate on table "public"."clinical_records" to "authenticated";

grant update on table "public"."clinical_records" to "authenticated";

grant delete on table "public"."clinical_records" to "service_role";

grant insert on table "public"."clinical_records" to "service_role";

grant references on table "public"."clinical_records" to "service_role";

grant select on table "public"."clinical_records" to "service_role";

grant trigger on table "public"."clinical_records" to "service_role";

grant truncate on table "public"."clinical_records" to "service_role";

grant update on table "public"."clinical_records" to "service_role";

grant delete on table "public"."customers" to "anon";

grant insert on table "public"."customers" to "anon";

grant references on table "public"."customers" to "anon";

grant select on table "public"."customers" to "anon";

grant trigger on table "public"."customers" to "anon";

grant truncate on table "public"."customers" to "anon";

grant update on table "public"."customers" to "anon";

grant delete on table "public"."customers" to "authenticated";

grant insert on table "public"."customers" to "authenticated";

grant references on table "public"."customers" to "authenticated";

grant select on table "public"."customers" to "authenticated";

grant trigger on table "public"."customers" to "authenticated";

grant truncate on table "public"."customers" to "authenticated";

grant update on table "public"."customers" to "authenticated";

grant delete on table "public"."customers" to "service_role";

grant insert on table "public"."customers" to "service_role";

grant references on table "public"."customers" to "service_role";

grant select on table "public"."customers" to "service_role";

grant trigger on table "public"."customers" to "service_role";

grant truncate on table "public"."customers" to "service_role";

grant update on table "public"."customers" to "service_role";

grant delete on table "public"."hospitalizations" to "anon";

grant insert on table "public"."hospitalizations" to "anon";

grant references on table "public"."hospitalizations" to "anon";

grant select on table "public"."hospitalizations" to "anon";

grant trigger on table "public"."hospitalizations" to "anon";

grant truncate on table "public"."hospitalizations" to "anon";

grant update on table "public"."hospitalizations" to "anon";

grant delete on table "public"."hospitalizations" to "authenticated";

grant insert on table "public"."hospitalizations" to "authenticated";

grant references on table "public"."hospitalizations" to "authenticated";

grant select on table "public"."hospitalizations" to "authenticated";

grant trigger on table "public"."hospitalizations" to "authenticated";

grant truncate on table "public"."hospitalizations" to "authenticated";

grant update on table "public"."hospitalizations" to "authenticated";

grant delete on table "public"."hospitalizations" to "service_role";

grant insert on table "public"."hospitalizations" to "service_role";

grant references on table "public"."hospitalizations" to "service_role";

grant select on table "public"."hospitalizations" to "service_role";

grant trigger on table "public"."hospitalizations" to "service_role";

grant truncate on table "public"."hospitalizations" to "service_role";

grant update on table "public"."hospitalizations" to "service_role";

grant delete on table "public"."invitations" to "anon";

grant insert on table "public"."invitations" to "anon";

grant references on table "public"."invitations" to "anon";

grant select on table "public"."invitations" to "anon";

grant trigger on table "public"."invitations" to "anon";

grant truncate on table "public"."invitations" to "anon";

grant update on table "public"."invitations" to "anon";

grant delete on table "public"."invitations" to "authenticated";

grant insert on table "public"."invitations" to "authenticated";

grant references on table "public"."invitations" to "authenticated";

grant select on table "public"."invitations" to "authenticated";

grant trigger on table "public"."invitations" to "authenticated";

grant truncate on table "public"."invitations" to "authenticated";

grant update on table "public"."invitations" to "authenticated";

grant delete on table "public"."invitations" to "service_role";

grant insert on table "public"."invitations" to "service_role";

grant references on table "public"."invitations" to "service_role";

grant select on table "public"."invitations" to "service_role";

grant trigger on table "public"."invitations" to "service_role";

grant truncate on table "public"."invitations" to "service_role";

grant update on table "public"."invitations" to "service_role";

grant delete on table "public"."order_items" to "anon";

grant insert on table "public"."order_items" to "anon";

grant references on table "public"."order_items" to "anon";

grant select on table "public"."order_items" to "anon";

grant trigger on table "public"."order_items" to "anon";

grant truncate on table "public"."order_items" to "anon";

grant update on table "public"."order_items" to "anon";

grant delete on table "public"."order_items" to "authenticated";

grant insert on table "public"."order_items" to "authenticated";

grant references on table "public"."order_items" to "authenticated";

grant select on table "public"."order_items" to "authenticated";

grant trigger on table "public"."order_items" to "authenticated";

grant truncate on table "public"."order_items" to "authenticated";

grant update on table "public"."order_items" to "authenticated";

grant delete on table "public"."order_items" to "service_role";

grant insert on table "public"."order_items" to "service_role";

grant references on table "public"."order_items" to "service_role";

grant select on table "public"."order_items" to "service_role";

grant trigger on table "public"."order_items" to "service_role";

grant truncate on table "public"."order_items" to "service_role";

grant update on table "public"."order_items" to "service_role";

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant delete on table "public"."orders" to "authenticated";

grant insert on table "public"."orders" to "authenticated";

grant references on table "public"."orders" to "authenticated";

grant select on table "public"."orders" to "authenticated";

grant trigger on table "public"."orders" to "authenticated";

grant truncate on table "public"."orders" to "authenticated";

grant update on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

grant delete on table "public"."otps" to "anon";

grant insert on table "public"."otps" to "anon";

grant references on table "public"."otps" to "anon";

grant select on table "public"."otps" to "anon";

grant trigger on table "public"."otps" to "anon";

grant truncate on table "public"."otps" to "anon";

grant update on table "public"."otps" to "anon";

grant delete on table "public"."otps" to "authenticated";

grant insert on table "public"."otps" to "authenticated";

grant references on table "public"."otps" to "authenticated";

grant select on table "public"."otps" to "authenticated";

grant trigger on table "public"."otps" to "authenticated";

grant truncate on table "public"."otps" to "authenticated";

grant update on table "public"."otps" to "authenticated";

grant delete on table "public"."otps" to "service_role";

grant insert on table "public"."otps" to "service_role";

grant references on table "public"."otps" to "service_role";

grant select on table "public"."otps" to "service_role";

grant trigger on table "public"."otps" to "service_role";

grant truncate on table "public"."otps" to "service_role";

grant update on table "public"."otps" to "service_role";

grant delete on table "public"."payment_methods" to "anon";

grant insert on table "public"."payment_methods" to "anon";

grant references on table "public"."payment_methods" to "anon";

grant select on table "public"."payment_methods" to "anon";

grant trigger on table "public"."payment_methods" to "anon";

grant truncate on table "public"."payment_methods" to "anon";

grant update on table "public"."payment_methods" to "anon";

grant delete on table "public"."payment_methods" to "authenticated";

grant insert on table "public"."payment_methods" to "authenticated";

grant references on table "public"."payment_methods" to "authenticated";

grant select on table "public"."payment_methods" to "authenticated";

grant trigger on table "public"."payment_methods" to "authenticated";

grant truncate on table "public"."payment_methods" to "authenticated";

grant update on table "public"."payment_methods" to "authenticated";

grant delete on table "public"."payment_methods" to "service_role";

grant insert on table "public"."payment_methods" to "service_role";

grant references on table "public"."payment_methods" to "service_role";

grant select on table "public"."payment_methods" to "service_role";

grant trigger on table "public"."payment_methods" to "service_role";

grant truncate on table "public"."payment_methods" to "service_role";

grant update on table "public"."payment_methods" to "service_role";

grant delete on table "public"."payments" to "anon";

grant insert on table "public"."payments" to "anon";

grant references on table "public"."payments" to "anon";

grant select on table "public"."payments" to "anon";

grant trigger on table "public"."payments" to "anon";

grant truncate on table "public"."payments" to "anon";

grant update on table "public"."payments" to "anon";

grant delete on table "public"."payments" to "authenticated";

grant insert on table "public"."payments" to "authenticated";

grant references on table "public"."payments" to "authenticated";

grant select on table "public"."payments" to "authenticated";

grant trigger on table "public"."payments" to "authenticated";

grant truncate on table "public"."payments" to "authenticated";

grant update on table "public"."payments" to "authenticated";

grant delete on table "public"."payments" to "service_role";

grant insert on table "public"."payments" to "service_role";

grant references on table "public"."payments" to "service_role";

grant select on table "public"."payments" to "service_role";

grant trigger on table "public"."payments" to "service_role";

grant truncate on table "public"."payments" to "service_role";

grant update on table "public"."payments" to "service_role";

grant delete on table "public"."pets" to "anon";

grant insert on table "public"."pets" to "anon";

grant references on table "public"."pets" to "anon";

grant select on table "public"."pets" to "anon";

grant trigger on table "public"."pets" to "anon";

grant truncate on table "public"."pets" to "anon";

grant update on table "public"."pets" to "anon";

grant delete on table "public"."pets" to "authenticated";

grant insert on table "public"."pets" to "authenticated";

grant references on table "public"."pets" to "authenticated";

grant select on table "public"."pets" to "authenticated";

grant trigger on table "public"."pets" to "authenticated";

grant truncate on table "public"."pets" to "authenticated";

grant update on table "public"."pets" to "authenticated";

grant delete on table "public"."pets" to "service_role";

grant insert on table "public"."pets" to "service_role";

grant references on table "public"."pets" to "service_role";

grant select on table "public"."pets" to "service_role";

grant trigger on table "public"."pets" to "service_role";

grant truncate on table "public"."pets" to "service_role";

grant update on table "public"."pets" to "service_role";

grant delete on table "public"."product_brands" to "anon";

grant insert on table "public"."product_brands" to "anon";

grant references on table "public"."product_brands" to "anon";

grant select on table "public"."product_brands" to "anon";

grant trigger on table "public"."product_brands" to "anon";

grant truncate on table "public"."product_brands" to "anon";

grant update on table "public"."product_brands" to "anon";

grant delete on table "public"."product_brands" to "authenticated";

grant insert on table "public"."product_brands" to "authenticated";

grant references on table "public"."product_brands" to "authenticated";

grant select on table "public"."product_brands" to "authenticated";

grant trigger on table "public"."product_brands" to "authenticated";

grant truncate on table "public"."product_brands" to "authenticated";

grant update on table "public"."product_brands" to "authenticated";

grant delete on table "public"."product_brands" to "service_role";

grant insert on table "public"."product_brands" to "service_role";

grant references on table "public"."product_brands" to "service_role";

grant select on table "public"."product_brands" to "service_role";

grant trigger on table "public"."product_brands" to "service_role";

grant truncate on table "public"."product_brands" to "service_role";

grant update on table "public"."product_brands" to "service_role";

grant delete on table "public"."product_categories" to "anon";

grant insert on table "public"."product_categories" to "anon";

grant references on table "public"."product_categories" to "anon";

grant select on table "public"."product_categories" to "anon";

grant trigger on table "public"."product_categories" to "anon";

grant truncate on table "public"."product_categories" to "anon";

grant update on table "public"."product_categories" to "anon";

grant delete on table "public"."product_categories" to "authenticated";

grant insert on table "public"."product_categories" to "authenticated";

grant references on table "public"."product_categories" to "authenticated";

grant select on table "public"."product_categories" to "authenticated";

grant trigger on table "public"."product_categories" to "authenticated";

grant truncate on table "public"."product_categories" to "authenticated";

grant update on table "public"."product_categories" to "authenticated";

grant delete on table "public"."product_categories" to "service_role";

grant insert on table "public"."product_categories" to "service_role";

grant references on table "public"."product_categories" to "service_role";

grant select on table "public"."product_categories" to "service_role";

grant trigger on table "public"."product_categories" to "service_role";

grant truncate on table "public"."product_categories" to "service_role";

grant update on table "public"."product_categories" to "service_role";

grant delete on table "public"."product_movements" to "anon";

grant insert on table "public"."product_movements" to "anon";

grant references on table "public"."product_movements" to "anon";

grant select on table "public"."product_movements" to "anon";

grant trigger on table "public"."product_movements" to "anon";

grant truncate on table "public"."product_movements" to "anon";

grant update on table "public"."product_movements" to "anon";

grant delete on table "public"."product_movements" to "authenticated";

grant insert on table "public"."product_movements" to "authenticated";

grant references on table "public"."product_movements" to "authenticated";

grant select on table "public"."product_movements" to "authenticated";

grant trigger on table "public"."product_movements" to "authenticated";

grant truncate on table "public"."product_movements" to "authenticated";

grant update on table "public"."product_movements" to "authenticated";

grant delete on table "public"."product_movements" to "service_role";

grant insert on table "public"."product_movements" to "service_role";

grant references on table "public"."product_movements" to "service_role";

grant select on table "public"."product_movements" to "service_role";

grant trigger on table "public"."product_movements" to "service_role";

grant truncate on table "public"."product_movements" to "service_role";

grant update on table "public"."product_movements" to "service_role";

grant delete on table "public"."product_units" to "anon";

grant insert on table "public"."product_units" to "anon";

grant references on table "public"."product_units" to "anon";

grant select on table "public"."product_units" to "anon";

grant trigger on table "public"."product_units" to "anon";

grant truncate on table "public"."product_units" to "anon";

grant update on table "public"."product_units" to "anon";

grant delete on table "public"."product_units" to "authenticated";

grant insert on table "public"."product_units" to "authenticated";

grant references on table "public"."product_units" to "authenticated";

grant select on table "public"."product_units" to "authenticated";

grant trigger on table "public"."product_units" to "authenticated";

grant truncate on table "public"."product_units" to "authenticated";

grant update on table "public"."product_units" to "authenticated";

grant delete on table "public"."product_units" to "service_role";

grant insert on table "public"."product_units" to "service_role";

grant references on table "public"."product_units" to "service_role";

grant select on table "public"."product_units" to "service_role";

grant trigger on table "public"."product_units" to "service_role";

grant truncate on table "public"."product_units" to "service_role";

grant update on table "public"."product_units" to "service_role";

grant delete on table "public"."products" to "anon";

grant insert on table "public"."products" to "anon";

grant references on table "public"."products" to "anon";

grant select on table "public"."products" to "anon";

grant trigger on table "public"."products" to "anon";

grant truncate on table "public"."products" to "anon";

grant update on table "public"."products" to "anon";

grant delete on table "public"."products" to "authenticated";

grant insert on table "public"."products" to "authenticated";

grant references on table "public"."products" to "authenticated";

grant select on table "public"."products" to "authenticated";

grant trigger on table "public"."products" to "authenticated";

grant truncate on table "public"."products" to "authenticated";

grant update on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."record_items" to "anon";

grant insert on table "public"."record_items" to "anon";

grant references on table "public"."record_items" to "anon";

grant select on table "public"."record_items" to "anon";

grant trigger on table "public"."record_items" to "anon";

grant truncate on table "public"."record_items" to "anon";

grant update on table "public"."record_items" to "anon";

grant delete on table "public"."record_items" to "authenticated";

grant insert on table "public"."record_items" to "authenticated";

grant references on table "public"."record_items" to "authenticated";

grant select on table "public"."record_items" to "authenticated";

grant trigger on table "public"."record_items" to "authenticated";

grant truncate on table "public"."record_items" to "authenticated";

grant update on table "public"."record_items" to "authenticated";

grant delete on table "public"."record_items" to "service_role";

grant insert on table "public"."record_items" to "service_role";

grant references on table "public"."record_items" to "service_role";

grant select on table "public"."record_items" to "service_role";

grant trigger on table "public"."record_items" to "service_role";

grant truncate on table "public"."record_items" to "service_role";

grant update on table "public"."record_items" to "service_role";

grant delete on table "public"."roles" to "anon";

grant insert on table "public"."roles" to "anon";

grant references on table "public"."roles" to "anon";

grant select on table "public"."roles" to "anon";

grant trigger on table "public"."roles" to "anon";

grant truncate on table "public"."roles" to "anon";

grant update on table "public"."roles" to "anon";

grant delete on table "public"."roles" to "authenticated";

grant insert on table "public"."roles" to "authenticated";

grant references on table "public"."roles" to "authenticated";

grant select on table "public"."roles" to "authenticated";

grant trigger on table "public"."roles" to "authenticated";

grant truncate on table "public"."roles" to "authenticated";

grant update on table "public"."roles" to "authenticated";

grant delete on table "public"."roles" to "service_role";

grant insert on table "public"."roles" to "service_role";

grant references on table "public"."roles" to "service_role";

grant select on table "public"."roles" to "service_role";

grant trigger on table "public"."roles" to "service_role";

grant truncate on table "public"."roles" to "service_role";

grant update on table "public"."roles" to "service_role";

grant delete on table "public"."specialties" to "anon";

grant insert on table "public"."specialties" to "anon";

grant references on table "public"."specialties" to "anon";

grant select on table "public"."specialties" to "anon";

grant trigger on table "public"."specialties" to "anon";

grant truncate on table "public"."specialties" to "anon";

grant update on table "public"."specialties" to "anon";

grant delete on table "public"."specialties" to "authenticated";

grant insert on table "public"."specialties" to "authenticated";

grant references on table "public"."specialties" to "authenticated";

grant select on table "public"."specialties" to "authenticated";

grant trigger on table "public"."specialties" to "authenticated";

grant truncate on table "public"."specialties" to "authenticated";

grant update on table "public"."specialties" to "authenticated";

grant delete on table "public"."specialties" to "service_role";

grant insert on table "public"."specialties" to "service_role";

grant references on table "public"."specialties" to "service_role";

grant select on table "public"."specialties" to "service_role";

grant trigger on table "public"."specialties" to "service_role";

grant truncate on table "public"."specialties" to "service_role";

grant update on table "public"."specialties" to "service_role";

grant delete on table "public"."species" to "anon";

grant insert on table "public"."species" to "anon";

grant references on table "public"."species" to "anon";

grant select on table "public"."species" to "anon";

grant trigger on table "public"."species" to "anon";

grant truncate on table "public"."species" to "anon";

grant update on table "public"."species" to "anon";

grant delete on table "public"."species" to "authenticated";

grant insert on table "public"."species" to "authenticated";

grant references on table "public"."species" to "authenticated";

grant select on table "public"."species" to "authenticated";

grant trigger on table "public"."species" to "authenticated";

grant truncate on table "public"."species" to "authenticated";

grant update on table "public"."species" to "authenticated";

grant delete on table "public"."species" to "service_role";

grant insert on table "public"."species" to "service_role";

grant references on table "public"."species" to "service_role";

grant select on table "public"."species" to "service_role";

grant trigger on table "public"."species" to "service_role";

grant truncate on table "public"."species" to "service_role";

grant update on table "public"."species" to "service_role";

grant delete on table "public"."staff" to "anon";

grant insert on table "public"."staff" to "anon";

grant references on table "public"."staff" to "anon";

grant select on table "public"."staff" to "anon";

grant trigger on table "public"."staff" to "anon";

grant truncate on table "public"."staff" to "anon";

grant update on table "public"."staff" to "anon";

grant delete on table "public"."staff" to "authenticated";

grant insert on table "public"."staff" to "authenticated";

grant references on table "public"."staff" to "authenticated";

grant select on table "public"."staff" to "authenticated";

grant trigger on table "public"."staff" to "authenticated";

grant truncate on table "public"."staff" to "authenticated";

grant update on table "public"."staff" to "authenticated";

grant delete on table "public"."staff" to "service_role";

grant insert on table "public"."staff" to "service_role";

grant references on table "public"."staff" to "service_role";

grant select on table "public"."staff" to "service_role";

grant trigger on table "public"."staff" to "service_role";

grant truncate on table "public"."staff" to "service_role";

grant update on table "public"."staff" to "service_role";

grant delete on table "public"."staff_specialties" to "anon";

grant insert on table "public"."staff_specialties" to "anon";

grant references on table "public"."staff_specialties" to "anon";

grant select on table "public"."staff_specialties" to "anon";

grant trigger on table "public"."staff_specialties" to "anon";

grant truncate on table "public"."staff_specialties" to "anon";

grant update on table "public"."staff_specialties" to "anon";

grant delete on table "public"."staff_specialties" to "authenticated";

grant insert on table "public"."staff_specialties" to "authenticated";

grant references on table "public"."staff_specialties" to "authenticated";

grant select on table "public"."staff_specialties" to "authenticated";

grant trigger on table "public"."staff_specialties" to "authenticated";

grant truncate on table "public"."staff_specialties" to "authenticated";

grant update on table "public"."staff_specialties" to "authenticated";

grant delete on table "public"."staff_specialties" to "service_role";

grant insert on table "public"."staff_specialties" to "service_role";

grant references on table "public"."staff_specialties" to "service_role";

grant select on table "public"."staff_specialties" to "service_role";

grant trigger on table "public"."staff_specialties" to "service_role";

grant truncate on table "public"."staff_specialties" to "service_role";

grant update on table "public"."staff_specialties" to "service_role";

grant delete on table "public"."supplier_brands" to "anon";

grant insert on table "public"."supplier_brands" to "anon";

grant references on table "public"."supplier_brands" to "anon";

grant select on table "public"."supplier_brands" to "anon";

grant trigger on table "public"."supplier_brands" to "anon";

grant truncate on table "public"."supplier_brands" to "anon";

grant update on table "public"."supplier_brands" to "anon";

grant delete on table "public"."supplier_brands" to "authenticated";

grant insert on table "public"."supplier_brands" to "authenticated";

grant references on table "public"."supplier_brands" to "authenticated";

grant select on table "public"."supplier_brands" to "authenticated";

grant trigger on table "public"."supplier_brands" to "authenticated";

grant truncate on table "public"."supplier_brands" to "authenticated";

grant update on table "public"."supplier_brands" to "authenticated";

grant delete on table "public"."supplier_brands" to "service_role";

grant insert on table "public"."supplier_brands" to "service_role";

grant references on table "public"."supplier_brands" to "service_role";

grant select on table "public"."supplier_brands" to "service_role";

grant trigger on table "public"."supplier_brands" to "service_role";

grant truncate on table "public"."supplier_brands" to "service_role";

grant update on table "public"."supplier_brands" to "service_role";

grant delete on table "public"."suppliers" to "anon";

grant insert on table "public"."suppliers" to "anon";

grant references on table "public"."suppliers" to "anon";

grant select on table "public"."suppliers" to "anon";

grant trigger on table "public"."suppliers" to "anon";

grant truncate on table "public"."suppliers" to "anon";

grant update on table "public"."suppliers" to "anon";

grant delete on table "public"."suppliers" to "authenticated";

grant insert on table "public"."suppliers" to "authenticated";

grant references on table "public"."suppliers" to "authenticated";

grant select on table "public"."suppliers" to "authenticated";

grant trigger on table "public"."suppliers" to "authenticated";

grant truncate on table "public"."suppliers" to "authenticated";

grant update on table "public"."suppliers" to "authenticated";

grant delete on table "public"."suppliers" to "service_role";

grant insert on table "public"."suppliers" to "service_role";

grant references on table "public"."suppliers" to "service_role";

grant select on table "public"."suppliers" to "service_role";

grant trigger on table "public"."suppliers" to "service_role";

grant truncate on table "public"."suppliers" to "service_role";

grant update on table "public"."suppliers" to "service_role";

grant delete on table "public"."surgeries" to "anon";

grant insert on table "public"."surgeries" to "anon";

grant references on table "public"."surgeries" to "anon";

grant select on table "public"."surgeries" to "anon";

grant trigger on table "public"."surgeries" to "anon";

grant truncate on table "public"."surgeries" to "anon";

grant update on table "public"."surgeries" to "anon";

grant delete on table "public"."surgeries" to "authenticated";

grant insert on table "public"."surgeries" to "authenticated";

grant references on table "public"."surgeries" to "authenticated";

grant select on table "public"."surgeries" to "authenticated";

grant trigger on table "public"."surgeries" to "authenticated";

grant truncate on table "public"."surgeries" to "authenticated";

grant update on table "public"."surgeries" to "authenticated";

grant delete on table "public"."surgeries" to "service_role";

grant insert on table "public"."surgeries" to "service_role";

grant references on table "public"."surgeries" to "service_role";

grant select on table "public"."surgeries" to "service_role";

grant trigger on table "public"."surgeries" to "service_role";

grant truncate on table "public"."surgeries" to "service_role";

grant update on table "public"."surgeries" to "service_role";

grant delete on table "public"."tenant_counters" to "anon";

grant insert on table "public"."tenant_counters" to "anon";

grant references on table "public"."tenant_counters" to "anon";

grant select on table "public"."tenant_counters" to "anon";

grant trigger on table "public"."tenant_counters" to "anon";

grant truncate on table "public"."tenant_counters" to "anon";

grant update on table "public"."tenant_counters" to "anon";

grant delete on table "public"."tenant_counters" to "authenticated";

grant insert on table "public"."tenant_counters" to "authenticated";

grant references on table "public"."tenant_counters" to "authenticated";

grant select on table "public"."tenant_counters" to "authenticated";

grant trigger on table "public"."tenant_counters" to "authenticated";

grant truncate on table "public"."tenant_counters" to "authenticated";

grant update on table "public"."tenant_counters" to "authenticated";

grant delete on table "public"."tenant_counters" to "service_role";

grant insert on table "public"."tenant_counters" to "service_role";

grant references on table "public"."tenant_counters" to "service_role";

grant select on table "public"."tenant_counters" to "service_role";

grant trigger on table "public"."tenant_counters" to "service_role";

grant truncate on table "public"."tenant_counters" to "service_role";

grant update on table "public"."tenant_counters" to "service_role";

grant delete on table "public"."tenant_users" to "anon";

grant insert on table "public"."tenant_users" to "anon";

grant references on table "public"."tenant_users" to "anon";

grant select on table "public"."tenant_users" to "anon";

grant trigger on table "public"."tenant_users" to "anon";

grant truncate on table "public"."tenant_users" to "anon";

grant update on table "public"."tenant_users" to "anon";

grant delete on table "public"."tenant_users" to "authenticated";

grant insert on table "public"."tenant_users" to "authenticated";

grant references on table "public"."tenant_users" to "authenticated";

grant select on table "public"."tenant_users" to "authenticated";

grant trigger on table "public"."tenant_users" to "authenticated";

grant truncate on table "public"."tenant_users" to "authenticated";

grant update on table "public"."tenant_users" to "authenticated";

grant delete on table "public"."tenant_users" to "service_role";

grant insert on table "public"."tenant_users" to "service_role";

grant references on table "public"."tenant_users" to "service_role";

grant select on table "public"."tenant_users" to "service_role";

grant trigger on table "public"."tenant_users" to "service_role";

grant truncate on table "public"."tenant_users" to "service_role";

grant update on table "public"."tenant_users" to "service_role";

grant delete on table "public"."tenants" to "anon";

grant insert on table "public"."tenants" to "anon";

grant references on table "public"."tenants" to "anon";

grant select on table "public"."tenants" to "anon";

grant trigger on table "public"."tenants" to "anon";

grant truncate on table "public"."tenants" to "anon";

grant update on table "public"."tenants" to "anon";

grant delete on table "public"."tenants" to "authenticated";

grant insert on table "public"."tenants" to "authenticated";

grant references on table "public"."tenants" to "authenticated";

grant select on table "public"."tenants" to "authenticated";

grant trigger on table "public"."tenants" to "authenticated";

grant truncate on table "public"."tenants" to "authenticated";

grant update on table "public"."tenants" to "authenticated";

grant delete on table "public"."tenants" to "service_role";

grant insert on table "public"."tenants" to "service_role";

grant references on table "public"."tenants" to "service_role";

grant select on table "public"."tenants" to "service_role";

grant trigger on table "public"."tenants" to "service_role";

grant truncate on table "public"."tenants" to "service_role";

grant update on table "public"."tenants" to "service_role";

grant delete on table "public"."trainings" to "anon";

grant insert on table "public"."trainings" to "anon";

grant references on table "public"."trainings" to "anon";

grant select on table "public"."trainings" to "anon";

grant trigger on table "public"."trainings" to "anon";

grant truncate on table "public"."trainings" to "anon";

grant update on table "public"."trainings" to "anon";

grant delete on table "public"."trainings" to "authenticated";

grant insert on table "public"."trainings" to "authenticated";

grant references on table "public"."trainings" to "authenticated";

grant select on table "public"."trainings" to "authenticated";

grant trigger on table "public"."trainings" to "authenticated";

grant truncate on table "public"."trainings" to "authenticated";

grant update on table "public"."trainings" to "authenticated";

grant delete on table "public"."trainings" to "service_role";

grant insert on table "public"."trainings" to "service_role";

grant references on table "public"."trainings" to "service_role";

grant select on table "public"."trainings" to "service_role";

grant trigger on table "public"."trainings" to "service_role";

grant truncate on table "public"."trainings" to "service_role";

grant update on table "public"."trainings" to "service_role";

grant delete on table "public"."vaccinations" to "anon";

grant insert on table "public"."vaccinations" to "anon";

grant references on table "public"."vaccinations" to "anon";

grant select on table "public"."vaccinations" to "anon";

grant trigger on table "public"."vaccinations" to "anon";

grant truncate on table "public"."vaccinations" to "anon";

grant update on table "public"."vaccinations" to "anon";

grant delete on table "public"."vaccinations" to "authenticated";

grant insert on table "public"."vaccinations" to "authenticated";

grant references on table "public"."vaccinations" to "authenticated";

grant select on table "public"."vaccinations" to "authenticated";

grant trigger on table "public"."vaccinations" to "authenticated";

grant truncate on table "public"."vaccinations" to "authenticated";

grant update on table "public"."vaccinations" to "authenticated";

grant delete on table "public"."vaccinations" to "service_role";

grant insert on table "public"."vaccinations" to "service_role";

grant references on table "public"."vaccinations" to "service_role";

grant select on table "public"."vaccinations" to "service_role";

grant trigger on table "public"."vaccinations" to "service_role";

grant truncate on table "public"."vaccinations" to "service_role";

grant update on table "public"."vaccinations" to "service_role";

CREATE TRIGGER trg_order_recalc_totals AFTER INSERT OR DELETE OR UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.trg_order_recalc_totals();

CREATE TRIGGER set_orders_number AFTER INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.trg_generate_tenant_counter('order', 'ORD', 'order_number', '6');

CREATE TRIGGER trg_payments_recalc_order AFTER INSERT OR DELETE OR UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.trg_payments_recalc_order();

CREATE TRIGGER trg_payments_recalc_paid AFTER INSERT OR DELETE OR UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.trg_payments_recalc_paid();

CREATE TRIGGER trg_payments_set_customer BEFORE INSERT OR UPDATE OF order_id ON public.payments FOR EACH ROW EXECUTE FUNCTION public.trg_payments_set_customer();

CREATE TRIGGER trg_movements_update_stock AFTER INSERT OR DELETE OR UPDATE ON public.product_movements FOR EACH ROW EXECUTE FUNCTION public.trg_movements_update_stock();

CREATE TRIGGER trg_products_initial_stock AFTER INSERT ON public.products FOR EACH ROW EXECUTE FUNCTION public.trg_products_initial_stock();

CREATE TRIGGER trg_set_updated_metadata BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_metadata();

CREATE TRIGGER trg_set_updated_metadata BEFORE UPDATE ON public.tenant_users FOR EACH ROW EXECUTE FUNCTION public.set_updated_metadata();

CREATE TRIGGER tenants_ensure_owner_membership AFTER INSERT ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.ensure_owner_membership();

CREATE TRIGGER trg_set_updated_metadata BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.set_updated_metadata();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


