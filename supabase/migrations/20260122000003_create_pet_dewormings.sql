create table "public"."pet_dewormings" (
  "id" uuid not null default gen_random_uuid() primary key,
  "tenant_id" uuid not null references public.tenants(id),
  "clinical_record_id" uuid not null references public.clinical_records(id),
  "product" text,
  "dose" text,
  "route" text,
  "next_due_at" date,
  "adverse_event" text,
  "created_at" timestamp with time zone not null default (now() AT TIME ZONE 'utc'::text),
  "created_by" uuid default auth.uid(),
  "updated_by" uuid default auth.uid(),
  "updated_at" timestamp with time zone default (now() AT TIME ZONE 'utc'::text)
);

-- Habilitar RLS
alter table "public"."pet_dewormings" enable row level security;

-- Permisos básicos
grant select, insert, update, delete on table "public"."pet_dewormings" to authenticated;
grant all on table "public"."pet_dewormings" to service_role;

-- Políticas de RLS usando la tabla tenant_users
create policy "Enable read access for authenticated users based on tenant_id"
on "public"."pet_dewormings"
as permissive
for select
to authenticated
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = pet_dewormings.tenant_id
    and tu.user_id = auth.uid()
  )
);

create policy "Enable insert access for authenticated users based on tenant_id"
on "public"."pet_dewormings"
as permissive
for insert
to authenticated
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = pet_dewormings.tenant_id
    and tu.user_id = auth.uid()
  )
);

create policy "Enable update access for authenticated users based on tenant_id"
on "public"."pet_dewormings"
as permissive
for update
to authenticated
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = pet_dewormings.tenant_id
    and tu.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = pet_dewormings.tenant_id
    and tu.user_id = auth.uid()
  )
);

create policy "Enable delete access for authenticated users based on tenant_id"
on "public"."pet_dewormings"
as permissive
for delete
to authenticated
using (
  exists (
    select 1
    from public.tenant_users tu
    where tu.tenant_id = pet_dewormings.tenant_id
    and tu.user_id = auth.uid()
  )
);
