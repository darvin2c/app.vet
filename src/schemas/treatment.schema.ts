import { z } from 'zod'
import { ConsultationSchema } from './consultation.schema'
import { VaccinationSchema } from './vaccinations.schema'
import { SurgerySchema } from './surgeries.schema'
import { TrainingSchema } from './trainings.schema'
import { HospitalizationSchema } from './hospitalizations.schema'
import { BoardingSchema } from './boardings.schema'
import { GroomingSchema } from './grooming.schema'
import { DewormingSchema } from './deworming.schema'

export const TreatmentSchema = z.object({
  pet_id: z.string().nonempty('La mascota es requerida'),
  reason: z.string().optional(),
  treatment_type: z
    .enum([
      'consultation',
      'vaccination',
      'surgery',
      'grooming',
      'hospitalization',
      'deworming',
      'boarding',
      'training',
    ])
    .refine((val) => val !== undefined, {
      message: 'El tipo de tratamiento es requerido',
    }),
  status: z
    .enum(['draft', 'completed', 'cancelled'])
    .refine((val) => val !== undefined, {
      message: 'El estado es requerido',
    }),
  treatment_date: z.string().nonempty('La fecha de tratamiento es requerida'),
  vet_id: z.string().optional(),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
  
  // Campos opcionales de consulta
  symptoms: z.string().optional(),
  temperature: z.string().optional(),
  weight: z.string().optional(),
  blood_pressure_systolic: z.string().optional(),
  blood_pressure_diastolic: z.string().optional(),
  heart_rate: z.string().optional(),
  respiratory_rate: z.string().optional(),
  physical_examination: z.string().optional(),
  treatment_plan: z.string().optional(),
  consultation_notes: z.string().optional(),
  
  // Campos opcionales de vacunación
  dose: z.string().optional(),
  route: z.string().optional(),
  site: z.string().optional(),
  next_due_at: z.string().optional(),
  adverse_event: z.string().optional(),
  
  // Campos opcionales de cirugía
  duration_min: z.number().min(1, 'La duración debe ser mayor a 0').optional(),
  surgeon_notes: z.string().optional(),
  complications: z.string().optional(),
  
  // Campos opcionales de entrenamiento
  goal: z.string().optional(),
  sessions_planned: z.number().min(1, 'Debe ser mayor a 0').optional(),
  sessions_completed: z.number().min(0, 'Debe ser mayor o igual a 0').optional(),
  trainer_id: z.string().optional(),
  progress_notes: z.string().optional(),
  
  // Campos opcionales de hospitalización
  admission_at: z.string().optional(),
  discharge_at: z.string().optional(),
  bed_id: z.string().optional(),
  daily_rate: z.number().min(0, 'La tarifa diaria debe ser mayor o igual a 0').optional(),
  
  // Campos opcionales de hospedaje
  check_in_at: z.string().optional(),
  check_out_at: z.string().optional(),
  kennel_id: z.string().optional(),
  feeding_notes: z.string().optional(),
  observations: z.string().optional(),
  
  // Campos opcionales de peluquería
  service_type: z.string().optional(),
  products_used: z.string().optional(),
  coat_condition: z.string().optional(),
  special_instructions: z.string().optional(),
  before_photos: z.string().optional(),
  after_photos: z.string().optional(),
  groomer_notes: z.string().optional(),
  
  // Campos opcionales de desparasitación
  parasite_type: z.string().optional(),
  medication: z.string().optional(),
  dosage: z.string().optional(),
  administration_route: z.string().optional(),
  next_dose_date: z.string().optional(),
  weight_at_treatment: z.number().min(0, 'El peso debe ser mayor a 0').optional(),
  treatment_notes: z.string().optional(),
})

export type TreatmentFormData = z.infer<typeof TreatmentSchema>
