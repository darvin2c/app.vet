import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'
import { Tables } from '@/types/supabase.types'

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
}: {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
} = {}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'users', filters, search, orders],
    queryFn: async (): Promise<UserWithRole[]> => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('tenant_users')
        .select(
          `
          *,
          role:role_id(*),
          profile:user_id(*)
        `
        )
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      filters.forEach((filter) => {})

      // Aplicar ordenamiento
      orders.forEach((order) => {
        query = query.order(order.field, {
          ascending: order.direction === 'asc',
        })
      })

      const { data, error } = await query
      if (error) {
        throw new Error(`Error al obtener usuarios: ${error.message}`)
      }

      const users = data?.map((item) => ({
        ...item.profile,
        role: item.role,
        is_superuser: item.is_superuser,
        is_active: item.is_active,
      }))

      return users
    },
    enabled: !!currentTenant?.id,
  })
}
