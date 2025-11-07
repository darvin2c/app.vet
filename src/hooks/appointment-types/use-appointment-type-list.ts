import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase.types'
import { AppliedFilter } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type AppointmentType = Tables<'appointment_types'>

interface UseAppointmentTypeListParams {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
}

export function useAppointmentTypeList({
  filters = [],
  search,
  orders = [
    {
      field: 'created_at',
      direction: 'desc',
    },
  ],
}: UseAppointmentTypeListParams = {}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'appointment-types', filters, search, orders],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('appointment_types')
        .select('*')
        .eq('tenant_id', currentTenant.id)

      // Aplicar búsqueda
      if (search) {
        query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%`)
      }

      // Aplicar filtros
      filters.forEach((filter) => {
        query = query.filter(filter.field, filter.operator, filter.value)
      })

      // Aplicar ordenamiento
      orders.forEach((order) => {
        query = query.order(order.field, {
          ascending: order.direction === 'asc',
        })
      })

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data as AppointmentType[]
    },
    enabled: !!currentTenant?.id,
  })
}
