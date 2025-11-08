import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter, applySupabaseFilters } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'
import { AppliedPagination } from '@/components/ui/pagination'
import { applySupabaseSort } from '@/components/ui/order-by/generate-supabase-sort'
import { applySupabasePagination } from '@/components/ui/pagination/generate-supabase-pagination'

export default function useStaffList({
  filters = [],
  orders = [
    {
      field: 'created_at',
      direction: 'desc',
    },
  ],
  search,
  pagination,
}: {
  filters?: AppliedFilter[]
  orders?: AppliedSort[]
  search?: string
  pagination: AppliedPagination
}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'staff', filters, orders, search, pagination],
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
        `,
          { count: 'exact' }
        )
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      query = applySupabaseFilters(query, filters)

      // Aplicar ordenamientos
      query = applySupabaseSort(query, orders)

      // Aplicar paginación
      query = applySupabasePagination(query, pagination)

      // Aplicar búsqueda global
      if (search) {
        query = query.or(
          `full_name.ilike.%${search}%,email.ilike.%${search}%,last_name.ilike.%${search}%`
        )
      }

      const { data, count, error } = await query

      if (error) {
        throw new Error(`Error al obtener staff: ${error.message}`)
      }

      return {
        data,
        total: count || 0,
        ...pagination,
      }
    },
    enabled: !!currentTenant?.id,
  })
}
