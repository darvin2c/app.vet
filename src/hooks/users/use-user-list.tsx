import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/types/order-by.types'
import { Tables } from '@/types/supabase.types'

type UserWithRole = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  avatar_url: string | null
  tenant_user: {
    id: string
    role_id: string | null
    is_superuser: boolean
    is_active: boolean
    role: Tables<'roles'> | null
  }
}

export function useUserList({
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
    queryKey: [
      currentTenant?.id,
      'users',
      JSON.stringify(filters),
      search,
      JSON.stringify(orders),
    ],
    queryFn: async (): Promise<UserWithRole[]> => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('tenant_users')
        .select(
          `
          tenant_user_id:id,
          role_id,
          is_superuser,
          is_active,
          roles:role_id(*),
          profiles:user_id(
            id,
            first_name,
            last_name,
            email,
            phone,
            avatar_url
          )
        `
        )
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      filters.forEach((filter) => {
        if (filter.field === 'is_superuser') {
          query = query.eq('is_superuser', filter.value === 'true')
        } else if (filter.field === 'role_id') {
          query = query.eq('role_id', filter.value)
        } else if (filter.field !== 'search') {
          query = query.eq(filter.field, filter.value)
        }
      })

      // Aplicar ordenamiento
      orders.forEach((order) => {
        if (order.field.startsWith('profiles.')) {
          // Para campos de profiles, usar foreignTable
          const profileField = order.field.replace('profiles.', '')
          query = query.order(profileField, {
            ascending: order.ascending,
            foreignTable: 'profiles',
          })
        } else {
          query = query.order(order.field, {
            ascending: order.ascending,
          })
        }
      })

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener usuarios: ${error.message}`)
      }

      // Transformar los datos para incluir información del rol
      const users: UserWithRole[] = (data || [])
        .filter((item: any) => item.profiles)
        .map((item: any) => ({
          id: item.profiles!.id,
          first_name: item.profiles!.first_name,
          last_name: item.profiles!.last_name,
          email: item.profiles!.email,
          phone: item.profiles!.phone,
          avatar_url: item.profiles!.avatar_url,
          tenant_user: {
            id: item.tenant_user_id,
            role_id: item.role_id,
            is_superuser: item.is_superuser,
            is_active: item.is_active,
            role: item.roles,
          },
        }))

      // Aplicar búsqueda global después de la transformación
      if (search) {
        const searchLower = search.toLowerCase()
        return users.filter(
          (user) =>
            user.first_name?.toLowerCase().includes(searchLower) ||
            user.last_name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower)
        )
      }

      return users
    },
    enabled: !!currentTenant?.id,
  })
}
