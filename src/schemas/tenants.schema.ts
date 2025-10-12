import { z } from 'zod'

// Esquema para crear un nuevo tenant
export const createTenantSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .max(50, 'El slug no puede exceder 50 caracteres')
    .regex(
      /^[a-z0-9-]+$/,
      'El slug solo puede contener letras minúsculas, números y guiones'
    )
    .refine(
      (val) => !val.startsWith('-') && !val.endsWith('-'),
      'El slug no puede empezar o terminar con guión'
    ),
  email: z
    .string()
    .email('Formato de email inválido')
    .optional()
    .or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  legal_name: z.string().optional().or(z.literal('')),
  tax_id: z.string().optional().or(z.literal('')),
  currency: z.string().optional().or(z.literal('')),
})

// Esquema para actualizar un tenant existente
export const updateTenantSchema = createTenantSchema.partial().extend({
  id: z.string().uuid('ID de tenant inválido'),
})

// Tipos derivados de los esquemas
export type CreateTenantInput = z.infer<typeof createTenantSchema>
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>

// Función para generar slug desde el nombre
export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
    .replace(/[\s_-]+/g, '-') // Reemplazar espacios y guiones bajos con guiones
    .replace(/^-+|-+$/g, '') // Remover guiones al inicio y final
}

// Esquema para validar eliminación (palabra de confirmación)
export const deleteTenantSchema = z.object({
  confirmationWord: z
    .string()
    .refine(
      (val) => val === 'ELIMINAR',
      'Debes escribir "ELIMINAR" para confirmar la eliminación'
    ),
})

export type DeleteTenantInput = z.infer<typeof deleteTenantSchema>
