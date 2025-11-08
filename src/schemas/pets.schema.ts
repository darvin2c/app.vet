import { z } from 'zod'

// Esquema base para mascota - basado en la tabla pets de Supabase
export const petBaseSchema = z.object({
  name: z
    .string()
    .nonempty('El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  species_id: z
    .string()
    .uuid('ID de especie inválido')
    .nonempty('La especie es requerida'),

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
  is_active: z.boolean().default(true),
})

// Esquema para crear mascota
export const petCreateSchema = petBaseSchema

// Esquema para actualizar mascota
export const petUpdateSchema = petBaseSchema.partial()

export const petImportSchema = petBaseSchema.extend({
  is_active: z.coerce.boolean().default(true),
})

// Tipos TypeScript derivados de los esquemas
export type CreatePetSchema = z.infer<typeof petCreateSchema>
export type UpdatePetSchema = z.infer<typeof petUpdateSchema>
