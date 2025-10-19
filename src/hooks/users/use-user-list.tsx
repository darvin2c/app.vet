import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/types/order-by.types'

export default function useUserList({
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
} = {}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'users', JSON.stringify(filters)],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('tenant_users')
        .select(
          `
          *,
          profiles:user_id(*)
        `
        )
        .eq('tenant_id', currentTenant.id)
        .eq('is_active', true)

      // Aplicar filtros
      filters.forEach((filter) => {
        if (filter.field === 'search' && filter.value) {
          // Buscar en los campos del perfil del usuario
          query = query.or(
            `profiles.first_name.ilike.%${filter.value}%,profiles.last_name.ilike.%${filter.value}%,profiles.email.ilike.%${filter.value}%`
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
          `profiles.first_name.ilike.%${search}%,profiles.last_name.ilike.%${search}%,profiles.email.ilike.%${search}%`
        )
      }

      const { data, error } = await query

      if (error) throw error

      return data.map((item) => item.profiles).filter(Boolean)
    },
    enabled: !!currentTenant?.id,
  })
}
