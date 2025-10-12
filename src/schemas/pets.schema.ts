import { z } from 'zod'

// Esquema base para mascota - basado en la tabla pets de Supabase
export const petBaseSchema = z.object({
  name: z
    .string()
    .nonempty('El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  species_id: z.string().nonempty('La especie es requerida'),

  breed_id: z.string().uuid('ID de raza inválido').optional(),

  client_id: z.string().nonempty('El cliente es requerido'),

  sex: z.enum(['M', 'F'], {
    message: 'Sexo debe ser M (Macho) o F (Hembra)',
  }),

  birth_date: z.string().optional(),

  weight: z
    .number()
    .positive('El peso debe ser positivo')
    .max(1000, 'El peso no puede exceder 1000 kg')
    .optional(),

  color: z
    .string()
    .max(50, 'El color no puede exceder 50 caracteres')
    .optional(),

  microchip: z
    .string()
    .max(50, 'El número de microchip no puede exceder 50 caracteres')
    .optional(),

  notes: z.string().optional(),
})

// Esquema para crear mascota
export const createPetSchema = petBaseSchema

// Esquema para actualizar mascota
export const updatePetSchema = petBaseSchema.partial().omit({ client_id: true })

// Esquema para filtros de mascota
export const petFiltersSchema = z.object({
  search: z.string().optional(),
  client_id: z.string().uuid().optional(),
  species_id: z.string().uuid().optional(),
  breed_id: z.string().uuid().optional(),
  sex: z.enum(['M', 'F']).optional(),
  created_from: z.string().optional(),
  created_to: z.string().optional(),
})

// Tipos TypeScript derivados de los esquemas
export type CreatePetSchema = z.infer<typeof createPetSchema>
export type UpdatePetSchema = z.infer<typeof updatePetSchema>
export type PetFilters = z.infer<typeof petFiltersSchema>
