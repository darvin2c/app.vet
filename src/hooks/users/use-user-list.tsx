import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter, applySupabaseFilters } from '@/components/ui/filters'
import { AppliedSort, applySupabaseSort } from '@/components/ui/order-by'
import { Tables } from '@/types/supabase.types'
import {
  AppliedPagination,
  applySupabasePagination,
} from '@/components/ui/pagination'
import { applySupabaseSearch } from '@/components/ui/search-input'

export type UserWithRole = Tables<'profiles'> & {
  role: Tables<'roles'> | null
  is_superuser: boolean | null
  is_active: boolean | null
}

export function useUserList({
  filters = [],
  search,
  orders = [
    {
      field: 'created_at',
      direction: 'desc',
    },
  ],
  pagination,
}: {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
  pagination?: AppliedPagination
} = {}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'users', filters, search, orders, pagination],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No se ha seleccionado un tenant')
      }

      let query = supabase
        .from('tenant_users')
        .select(
          `
          *,
          role:role_id(*),
          profile:user_id(*)
        `,
          {
            count: 'exact',
          }
        )
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      query = applySupabaseFilters(query, filters)
      query = applySupabaseSort(query, orders)
      query = applySupabasePagination(query, pagination)
      query = applySupabaseSearch(
        query,
        search,
        [],
        [
          {
            referencedTable: 'profile',
            fields: ['first_name', 'last_name', 'email'],
          },
        ]
      )

      const { data, count, error } = await query
      if (error) {
        throw new Error(`Error al obtener usuarios: ${error.message}`)
      }

      const users = data?.map((item) => ({
        ...item.profile,
        role: item.role,
        is_superuser: item.is_superuser,
        is_active: item.is_active,
      }))

      return {
        data: users || [],
        total: count || 0,
        ...pagination,
      }
    },
    enabled: !!currentTenant?.id,
  })
}
