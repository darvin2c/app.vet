import { z } from 'zod'

export const ClinicalParameterSchema = z.object({
  medical_record_id: z.string().nonempty('El registro médico es requerido'),
  measured_at: z.string().nonempty('La fecha de medición es requerida'),
  params: z.record(z.string(), z.union([z.string(), z.number()])),
  schema_version: z.number().default(1),
})

export type ClinicalParameterFormData = z.infer<typeof ClinicalParameterSchema>
