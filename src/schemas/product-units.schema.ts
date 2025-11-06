import { z } from 'zod'

export const productUnitBaseSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  abbreviation: z.string().nonempty('La abreviación es requerida').nullable(),
  is_active: z.boolean().default(true),
})

export const productUnitCreateSchema = productUnitBaseSchema.required()

export const productUnitUpdateSchema = productUnitBaseSchema.partial()

export const productUnitImportSchema = productUnitBaseSchema.extend({
  is_active: z.coerce.boolean().default(true),
})

export type ProductUnitCreateSchema = z.infer<typeof productUnitCreateSchema>
export type ProductUnitUpdateSchema = z.infer<typeof productUnitUpdateSchema>
