import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase.types'
import { AppliedFilter, applySupabaseFilters } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { applySupabaseSort } from '@/components/ui/order-by/generate-supabase-sort'
import { AppliedPagination } from '@/components/ui/pagination'
import { applySupabasePagination } from '@/components/ui/pagination/generate-supabase-pagination'

interface UseAppointmentTypeListParams {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
  pagination: AppliedPagination
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
  pagination,
}: UseAppointmentTypeListParams) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [
      currentTenant?.id,
      'appointment-types',
      filters,
      search,
      orders,
      pagination,
    ],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('appointment_types')
        .select('*', { count: 'exact' })
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      query = applySupabaseFilters(query, filters)

      // Aplicar ordenamiento
      query = applySupabaseSort(query, orders)
      // Aplicar paginación
      query = applySupabasePagination(query, pagination)

      // Aplicar búsqueda
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
      }
      const { data, count, error } = await query

      if (error) {
        throw error
      }

      return {
        data: data,
        total: count || 0,
        page: pagination?.page,
        pageSize: pagination?.pageSize,
      }
    },
    enabled: !!currentTenant?.id,
  })
}
