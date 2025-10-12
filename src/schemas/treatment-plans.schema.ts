import { z } from 'zod'

// Enums para estados
export const treatmentPlanStatusEnum = z.enum([
  'draft',
  'proposed',
  'accepted',
  'partially_accepted',
  'rejected',
  'completed',
  'cancelled',
])

export const treatmentPlanItemStatusEnum = z.enum([
  'planned',
  'accepted',
  'rejected',
  'scheduled',
  'in_progress',
  'completed',
  'cancelled',
])

// Treatment Plan Item Schemas
export const treatmentPlanItemBaseSchema = z.object({
  procedure_id: z.string().nonempty('El procedimiento es requerido'),
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  unit_price: z
    .number()
    .min(0, 'El precio unitario debe ser mayor o igual a 0'),
  total: z.number().min(0, 'El precio total debe ser mayor o igual a 0'),
  status: treatmentPlanItemStatusEnum.default('planned'),
  description: z.string().optional(),
  discount: z.number().min(0).optional(),
  phase: z.number().min(1).optional(),
  priority: z.number().min(1).optional(),
  surface: z.string().optional(),
  tooth: z.string().optional(),
  staff_id: z.string().optional(),
  appointment_id: z.string().optional(),
})

// Treatment Plan Base Schema
export const treatmentPlanBaseSchema = z.object({
  title: z
    .string()
    .nonempty('El título es requerido')
    .max(200, 'Título muy largo'),
  notes: z.string().optional(),
  status: treatmentPlanStatusEnum.default('draft'),
  subtotal: z.number().min(0, 'El subtotal debe ser positivo').default(0),
  discount: z.number().min(0, 'El descuento debe ser positivo').default(0),
  total: z.number().min(0, 'El total debe ser positivo').optional(),
  valid_until: z.string().optional(),
})

export const createTreatmentPlanSchema = treatmentPlanBaseSchema.extend({
  patient_id: z.string().nonempty('El paciente es requerido'),
  staff_id: z.string().optional(),
  items: z.array(treatmentPlanItemBaseSchema).optional().default([]),
})

export const updateTreatmentPlanSchema = treatmentPlanBaseSchema.extend({
  id: z.string().nonempty('El ID es requerido'),
  items: z.array(treatmentPlanItemBaseSchema).optional().default([]),
})

export const createTreatmentPlanItemSchema = treatmentPlanItemBaseSchema.extend(
  {
    plan_id: z.string().nonempty('El plan de tratamiento es requerido'),
  }
)

export const updateTreatmentPlanItemSchema = treatmentPlanItemBaseSchema.extend(
  {
    id: z.string().nonempty('El ID es requerido'),
    plan_id: z.string().nonempty('El plan de tratamiento es requerido'),
  }
)

// Schema para cambio de estado de plan
export const treatmentPlanStatusUpdateSchema = z.object({
  status: treatmentPlanStatusEnum,
  notes: z.string().optional(),
})

// Schema para cambio de estado de item
export const treatmentPlanItemStatusUpdateSchema = z.object({
  status: treatmentPlanItemStatusEnum,
  notes: z.string().optional(),
})

// Schema para aceptación masiva de items
export const treatmentPlanItemsBulkAcceptSchema = z.object({
  item_ids: z
    .array(z.string().nonempty('ID de item inválido'))
    .min(1, 'Debe seleccionar al menos un item'),
  status: z.enum(['accepted', 'rejected']),
  notes: z.string().optional(),
})

// Schema para filtros de búsqueda
export const treatmentPlanFiltersSchema = z.object({
  patient_id: z.string().optional(),
  staff_id: z.string().optional(),
  status: treatmentPlanStatusEnum.optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  search: z.string().optional(),
})

// Types
export type TreatmentPlan = z.infer<typeof treatmentPlanBaseSchema>
export type TreatmentPlanCreate = z.infer<typeof createTreatmentPlanSchema>
export type TreatmentPlanUpdate = z.infer<typeof updateTreatmentPlanSchema>
export type TreatmentPlanStatusUpdate = z.infer<
  typeof treatmentPlanStatusUpdateSchema
>
export type TreatmentPlanFilters = z.infer<typeof treatmentPlanFiltersSchema>

export type TreatmentPlanItem = z.infer<typeof treatmentPlanItemBaseSchema>
export type TreatmentPlanItemCreate = z.infer<
  typeof createTreatmentPlanItemSchema
>
export type TreatmentPlanItemUpdate = z.infer<
  typeof updateTreatmentPlanItemSchema
>
export type TreatmentPlanItemStatusUpdate = z.infer<
  typeof treatmentPlanItemStatusUpdateSchema
>

// Type definitions
export type TreatmentPlanStatus = z.infer<typeof treatmentPlanStatusEnum>
export type TreatmentPlanItemStatus = z.infer<
  typeof treatmentPlanItemStatusEnum
>

// Validaciones de transiciones de estado
export const VALID_PLAN_TRANSITIONS: Record<
  TreatmentPlanStatus,
  TreatmentPlanStatus[]
> = {
  draft: ['proposed', 'cancelled'],
  proposed: ['accepted', 'partially_accepted', 'rejected', 'cancelled'],
  accepted: ['completed', 'cancelled'],
  partially_accepted: ['accepted', 'completed', 'cancelled'],
  rejected: ['proposed', 'cancelled'],
  completed: [],
  cancelled: [],
}

export const VALID_ITEM_TRANSITIONS: Record<
  TreatmentPlanItemStatus,
  TreatmentPlanItemStatus[]
> = {
  planned: ['accepted', 'rejected', 'cancelled'],
  accepted: ['scheduled', 'cancelled'],
  rejected: ['planned', 'cancelled'],
  scheduled: ['in_progress', 'completed', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
}

// Función para validar transiciones
export function canTransitionPlanStatus(
  from: TreatmentPlanStatus,
  to: TreatmentPlanStatus
): boolean {
  return VALID_PLAN_TRANSITIONS[from]?.includes(to) ?? false
}

export function canTransitionItemStatus(
  from: TreatmentPlanItemStatus,
  to: TreatmentPlanItemStatus
): boolean {
  return VALID_ITEM_TRANSITIONS[from]?.includes(to) ?? false
}
