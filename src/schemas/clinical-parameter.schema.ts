import { z } from 'zod'

export const clinicalParameterSchema = z.object({
  pet_id: z.string().nonempty('El ID de la mascota es requerido'),
  measured_at: z.string().nonempty('La fecha de medición es requerida'),
  params: z
    .record(z.string(), z.union([z.string(), z.number()]))
    .optional()
    .default({}),
})

export type ClinicalParameterSchema = z.infer<typeof clinicalParameterSchema>
