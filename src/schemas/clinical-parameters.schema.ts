import { z } from 'zod'

export const ClinicalParameterSchema = z.object({
  record_id: z.string().optional(), // Hacer opcional la asociación con tratamiento
  pet_id: z.string().optional(), // Campo para relacionar con la mascota, no se muestra en el formulario
  measured_at: z.string().nonempty('La fecha de medición es requerida'),
  params: z.record(z.string(), z.union([z.string(), z.number()])),
  schema_version: z.number().optional(),
})

export type ClinicalParameterFormData = z.infer<typeof ClinicalParameterSchema>
