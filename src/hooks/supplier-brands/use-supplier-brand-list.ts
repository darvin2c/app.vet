import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { SupplierBrandFilters } from '@/schemas/supplier-brands.schema'

export default function useSupplierBrands(filters?: SupplierBrandFilters) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['supplier-brands', currentTenant?.id, filters],
    queryFn: async () => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase.from('supplier_brands').select(`
          *,
          suppliers (
            id,
            name,
            contact_person,
            email,
            is_active
          ),
          product_brands (
            id,
            name,
            description,
            is_active
          )
        `)

      // Aplicar filtros
      if (filters?.supplier_id) {
        query = query.eq('supplier_id', filters.supplier_id)
      }

      if (filters?.brand_id) {
        query = query.eq('brand_id', filters.brand_id)
      }

      // Filtro de búsqueda por nombre de proveedor o marca
      if (filters?.search) {
        query = query.or(
          `suppliers.name.ilike.%${filters.search}%,product_brands.name.ilike.%${filters.search}%`
        )
      }

      const { data, error } = await query.order('created_at', {
        ascending: false,
      })

      if (error) {
        throw new Error(
          `Error al obtener relaciones proveedor-marca: ${error.message}`
        )
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}
