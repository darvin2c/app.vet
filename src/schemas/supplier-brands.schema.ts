import { z } from 'zod'

// Esquema base para supplier_brands - relación many-to-many
export const supplierBrandBaseSchema = z.object({
  supplier_id: z.string().uuid('ID de proveedor inválido'),
  brand_id: z.string().uuid('ID de marca inválido'),
})

// Esquema para crear relación supplier-brand
export const createSupplierBrandSchema = supplierBrandBaseSchema

// Esquema para actualizar relación supplier-brand
export const updateSupplierBrandSchema = supplierBrandBaseSchema.partial()

// Esquema para filtros de supplier_brands
export const supplierBrandFiltersSchema = z.object({
  supplier_id: z.string().uuid().optional(),
  brand_id: z.string().uuid().optional(),
  search: z.string().optional(),
})

// Tipos TypeScript derivados
export type SupplierBrandBase = z.infer<typeof supplierBrandBaseSchema>
export type CreateSupplierBrandSchema = z.infer<typeof createSupplierBrandSchema>
export type UpdateSupplierBrandSchema = z.infer<typeof updateSupplierBrandSchema>
export type SupplierBrandFilters = z.infer<typeof supplierBrandFiltersSchema>

// Esquema para asignar múltiples marcas a un proveedor
export const assignBrandsToSupplierSchema = z.object({
  supplier_id: z.string().uuid('ID de proveedor inválido'),
  brand_ids: z
    .array(z.string().uuid('ID de marca inválido'))
    .min(1, 'Debe seleccionar al menos una marca')
    .max(50, 'No se pueden asignar más de 50 marcas'),
})

export type AssignBrandsToSupplierSchema = z.infer<typeof assignBrandsToSupplierSchema>

// Esquema para asignar múltiples proveedores a una marca
export const assignSuppliersToBrandSchema = z.object({
  brand_id: z.string().uuid('ID de marca inválido'),
  supplier_ids: z
    .array(z.string().uuid('ID de proveedor inválido'))
    .min(1, 'Debe seleccionar al menos un proveedor')
    .max(50, 'No se pueden asignar más de 50 proveedores'),
})

export type AssignSuppliersToBrandSchema = z.infer<typeof assignSuppliersToBrandSchema>