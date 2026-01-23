# 📑 Plan Resumen — [Deworming Module]

**Version:** v1.0 — **Date:** 2026-01-22 — **TZ:** America/Lima

## 1. 🎯 Objective

- Implementar el módulo de desparasitación (Deworming) replicando la funcionalidad y estructura del módulo de vacunación existente.

## 2. 📌 Scope

- ✅ In-Scope:
    - Creación de tabla `pet_dewormings` (migración).
    - Actualización de tipos `supabase.types.ts`.
    - Esquemas de validación (Zod).
    - Hooks de React Query (Create, Update, Delete).
    - Componentes de UI (Form, Create, Edit, Delete, Item, Actions).
    - Integración en la lista de historia clínica.
- ❌ Out-of-Scope:
    - Reportes avanzados.
    - Notificaciones automáticas (fuera de la lógica básica de guardado).

## 3. ⚙️ Implementation Strategy

- **Step 1: Database & Types**
    - Crear archivo de migración SQL para `pet_dewormings`.
    - Actualizar manualmente `src/types/supabase.types.ts` para incluir la definición de la nueva tabla y permitir el tipado estático durante el desarrollo.

- **Step 2: Schema & Hooks**
    - Crear `src/schemas/deworming.schema.ts`.
    - Crear hooks en `src/hooks/dewormings/`: `use-deworming-create.ts`, `use-deworming-update.ts`, `use-deworming-delete.ts`.

- **Step 3: UI Components**
    - Crear componentes en `src/components/medical-records/`:
        - `deworming-form.tsx` (Formulario base)
        - `deworming-create.tsx` (Sheet de creación)
        - `deworming-edit.tsx` (Sheet de edición)
        - `deworming-delete.tsx` (Diálogo de confirmación)
        - `deworming-actions.tsx` (Menú de acciones: Editar/Eliminar)
        - `records/deworming-item.tsx` (Visualización en lista)

- **Step 4: Integration**
    - Integrar `DewormingItem` en `clinical-record-item.tsx`.
    - Habilitar la creación desde `medical-record-quick-actions.tsx` (si aplica) o asegurar que se pueda invocar desde la UI principal.

## 4. 📂 Design Elements

- **Table: `pet_dewormings`**
    - `id`: uuid (PK)
    - `tenant_id`: uuid (FK)
    - `clinical_record_id`: uuid (FK -> clinical_records)
    - `product`: text (Nombre del desparasitante)
    - `dose`: text (Dosis aplicada)
    - `route`: text (Vía de administración)
    - `next_due_at`: date (Próxima desparasitación)
    - `adverse_event`: text (Eventos adversos)
    - `created_at`, `created_by`, `updated_at`, `updated_by`

- **Enums**
    - `record_type`: ya incluye 'deworming'.

### 4.1 📦 Packages

- ✅ installed: `zod`, `react-hook-form`, `lucide-react`, `date-fns`

## 5. ⚠️ Risks & Dependencies

- **Risk:** La actualización manual de `supabase.types.ts` puede desincronizarse si se regeneran los tipos automáticamente desde el backend real antes de aplicar la migración.
- **Mitigation:** El usuario debe aplicar la migración proporcionada.

## 6. ✔️ Acceptance Criteria

- Se puede registrar una desparasitación con: Producto, Dosis, Vía, Próxima fecha, Eventos adversos.
- Se visualiza en la historia clínica con el icono correspondiente.
- Se puede editar y eliminar el registro.
- Validaciones de formulario funcionan correctamente.

## 7. ✅ Task List

- [ ] Crear migración SQL `supabase/migrations/20260122_create_pet_dewormings.sql`
- [ ] Actualizar `src/types/supabase.types.ts`
- [ ] Crear `src/schemas/deworming.schema.ts`
- [ ] Crear `src/hooks/dewormings/use-deworming-create.ts`
- [ ] Crear `src/hooks/dewormings/use-deworming-update.ts`
- [ ] Crear `src/hooks/dewormings/use-deworming-delete.ts`
- [ ] Crear `src/components/medical-records/deworming-form.tsx`
- [ ] Crear `src/components/medical-records/deworming-create.tsx`
- [ ] Crear `src/components/medical-records/deworming-edit.tsx`
- [ ] Crear `src/components/medical-records/deworming-delete.tsx`
- [ ] Crear `src/components/medical-records/deworming-actions.tsx`
- [ ] Crear `src/components/medical-records/records/deworming-item.tsx`
- [ ] Integrar en `src/components/medical-records/records/clinical-record-item.tsx`
