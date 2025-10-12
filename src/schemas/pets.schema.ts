import { z } from 'zod'

// Esquema base para mascota - basado en la tabla pets de Supabase
export const petBaseSchema = z.object({
  name: z
    .string()
    .nonempty('El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  species: z
    .string()
    .nonempty('La especie es requerida')
    .max(50, 'La especie no puede exceder 50 caracteres'),

  breed_id: z.string().uuid('ID de raza inválido').optional(),

  client_id: z.string().uuid('ID de cliente inválido'),

  gender: z.enum(['male', 'female', 'unknown'], {
    errorMap: () => ({ message: 'Género debe ser masculino, femenino o desconocido' }),
  }).optional(),

  date_of_birth: z.string().optional(),

  weight: z
    .number()
    .positive('El peso debe ser positivo')
    .max(1000, 'El peso no puede exceder 1000 kg')
    .optional(),

  color: z.string().max(50, 'El color no puede exceder 50 caracteres').optional(),

  microchip_number: z
    .string()
    .max(50, 'El número de microchip no puede exceder 50 caracteres')
    .optional(),

  is_sterilized: z.boolean().optional(),

  allergies: z.string().optional(),

  medical_notes: z.string().optional(),

  is_active: z.boolean().default(true),
})

// Esquema para crear mascota
export const createPetSchema = petBaseSchema
  .omit({ is_active: true })
  .extend({
    is_active: z.boolean().default(true),
  })

// Esquema para actualizar mascota
export const updatePetSchema = petBaseSchema.partial().omit({ client_id: true })

// Esquema para filtros de búsqueda
export const petFiltersSchema = z.object({
  search: z.string().optional(),
  client_id: z.string().uuid().optional(),
  species: z.string().optional(),
  breed_id: z.string().uuid().optional(),
  gender: z.enum(['male', 'female', 'unknown']).optional(),
  is_active: z.boolean().optional(),
  is_sterilized: z.boolean().optional(),
  created_from: z.string().optional(),
  created_to: z.string().optional(),
})

// Tipos TypeScript derivados de los esquemas
export type CreatePetSchema = z.infer<typeof createPetSchema>
export type UpdatePetSchema = z.infer<typeof updatePetSchema>
export type PetFilters = z.infer<typeof petFiltersSchema>