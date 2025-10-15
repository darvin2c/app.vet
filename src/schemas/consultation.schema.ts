import { z } from 'zod'

export const ConsultationSchema = z.object({
  // Síntomas y motivo de consulta
  symptoms: z.string().optional().or(z.literal('')),
  
  // Signos vitales
  temperature: z
    .number()
    .min(35, 'La temperatura debe ser mayor a 35°C')
    .max(45, 'La temperatura debe ser menor a 45°C')
    .optional(),
  weight: z
    .number()
    .min(0.1, 'El peso debe ser mayor a 0.1 kg')
    .max(200, 'El peso debe ser menor a 200 kg')
    .optional(),
  blood_pressure_systolic: z
    .number()
    .min(50, 'La presión sistólica debe ser mayor a 50 mmHg')
    .max(300, 'La presión sistólica debe ser menor a 300 mmHg')
    .optional(),
  blood_pressure_diastolic: z
    .number()
    .min(30, 'La presión diastólica debe ser mayor a 30 mmHg')
    .max(200, 'La presión diastólica debe ser menor a 200 mmHg')
    .optional(),
  heart_rate: z
    .number()
    .min(40, 'La frecuencia cardíaca debe ser mayor a 40 bpm')
    .max(300, 'La frecuencia cardíaca debe ser menor a 300 bpm')
    .optional(),
  respiratory_rate: z
    .number()
    .min(5, 'La frecuencia respiratoria debe ser mayor a 5 rpm')
    .max(100, 'La frecuencia respiratoria debe ser menor a 100 rpm')
    .optional(),
  
  // Examen físico
  physical_examination: z.string().optional().or(z.literal('')),
  
  // Plan de tratamiento
  treatment_plan: z.string().optional().or(z.literal('')),
  
  // Observaciones adicionales
  consultation_notes: z.string().optional().or(z.literal('')),
})

export type ConsultationFormData = z.infer<typeof ConsultationSchema>