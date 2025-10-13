import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/types/order-by.types'

type Supplier = Database['public']['Tables']['suppliers']['Row']

export default function useSupplierList({
  filters = [],
  search,
  orders = [
    {
      field: 'created_at',
      ascending: false,
      direction: 'desc',
    },
  ],
}: {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'suppliers', JSON.stringify(filters)],
    queryFn: async (): Promise<Supplier[]> => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('suppliers')
        .select('*')
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      filters.forEach((filter) => {
        if (filter.field === 'search' && filter.value) {
          query = query.or(
            `name.ilike.%${filter.value}%,contact_person.ilike.%${filter.value}%,email.ilike.%${filter.value}%`
          )
        } else {
          query = query.eq(filter.field, filter.value)
        }
      })

      // Aplicar ordenamiento
      orders.forEach((order) => {
        query = query.order(order.field, {
          ascending: order.ascending,
        })
      })

      // Aplicar búsqueda global
      if (search) {
        query = query.or(
          `name.ilike.%${search}%,contact_person.ilike.%${search}%,email.ilike.%${search}%`
        )
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener proveedores: ${error.message}`)
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}
