import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'

export default function useStaffList({
  filters,
  orders,
  search,
}: {
  filters?: AppliedFilter[]
  orders?: AppliedSort[]
  search?: string
}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'staff', filters, orders, search],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Consulta con join para obtener las especialidades
      let query = supabase
        .from('staff')
        .select(
          `
          *,
          staff_specialties (
            specialty_id,
            specialties (
              id,
              name,
              is_active
            )
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      filters?.forEach((filter) => {
        query.filter(filter.field, filter.operator, filter.value)
      })

      // Aplicar ordenamientos
      orders?.forEach((order) => {
        query.order(order.field, { ascending: order.direction === 'asc' })
      })

      // Aplicar búsqueda global
      if (search) {
        query = query.or(
          `full_name.ilike.%${search}%,email.ilike.%${search}%,last_name.ilike.%${search}%`
        )
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener staff: ${error.message}`)
      }

      return data
    },
    enabled: !!currentTenant?.id,
  })
}
