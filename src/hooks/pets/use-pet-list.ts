import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/types/order-by.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type Pet = Tables<'pets'> & {
  customers: Tables<'customers'> | null
  breeds: Tables<'breeds'> | null
  species: Tables<'species'> | null
}

interface UsePetsParams {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
}

export function usePets(params?: UsePetsParams) {
  const { filters = [], search, orders = [] } = params || {}
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'pets', filters, search, orders],
    queryFn: async () => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase.from('pets').select(
        `
          *,
          customers (
            id,
            first_name,
            last_name,
            email,
            phone
          ),
          breeds (
            id,
            name
          ),
          species (
            id,
            name
          )
        `
      ).eq('tenant_id', currentTenant.id)

      // Aplicar búsqueda
      if (search) {
        query = query.or(`name.ilike.%${search}%,microchip.ilike.%${search}%`)
      }

      // Aplicar filtros
      filters.forEach((filter) => {
        switch (filter.field) {
          case 'client_id':
            query = query.eq('client_id', filter.value)
            break
          case 'species_id':
            query = query.eq('species_id', filter.value)
            break
          case 'breed_id':
            query = query.eq('breed_id', filter.value)
            break
          case 'sex':
            query = query.eq('sex', filter.value)
            break
          case 'is_active':
            query = query.eq('is_active', filter.value)
            break
          case 'created_from':
            query = query.gte('created_at', filter.value)
            break
          case 'created_to':
            query = query.lte('created_at', filter.value)
            break
        }
      })

      // Aplicar ordenamiento
      if (orders.length > 0) {
        orders.forEach((order) => {
          query = query.order(order.field, {
            ascending: order.direction === 'asc',
          })
        })
      } else {
        // Orden por defecto
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener mascotas: ${error.message}`)
      }

      return data as Pet[]
    },
    enabled: !!currentTenant?.id,
  })
}
