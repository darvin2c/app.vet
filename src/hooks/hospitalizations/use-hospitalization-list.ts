import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/components/ui/order-by'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

// Tipo para hospitalization (sin pet_id por ahora, se agregará después)
type Hospitalization = Tables<'hospitalizations'>

interface UseHospitalizationsParams {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
  petId?: string
}

export function useHospitalizations(params?: UseHospitalizationsParams) {
  const { filters = [], search, orders = [], petId } = params || {}
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [
      currentTenant?.id,
      'hospitalizations',
      filters,
      search,
      orders,
      petId,
    ],
    queryFn: async () => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('hospitalizations')
        .select('*')
        .eq('tenant_id', currentTenant.id)

      // Filtrar por mascota específica si se proporciona petId
      // Nota: Esto funcionará cuando se agregue el campo pet_id a la tabla
      if (petId) {
        // query = query.eq('pet_id', petId)
        // Por ahora, devolvemos array vacío ya que no existe pet_id
        return []
      }

      // Aplicar búsqueda
      if (search) {
        query = query.or(`notes.ilike.%${search}%,bed_id.ilike.%${search}%`)
      }

      // Aplicar filtros
      filters.forEach((filter) => {
        switch (filter.field) {
          case 'pet_id':
            // query = query.eq('pet_id', filter.value)
            // Por ahora comentado hasta que se agregue pet_id
            break
          case 'bed_id':
            query = query.eq('bed_id', filter.value)
            break
          case 'status':
            // Filtro por estado (activo/alta)
            if (filter.value === 'active') {
              query = query.is('discharge_at', null)
            } else if (filter.value === 'discharged') {
              query = query.not('discharge_at', 'is', null)
            }
            break
          case 'admission_from':
            query = query.gte('admission_at', filter.value)
            break
          case 'admission_to':
            query = query.lte('admission_at', filter.value)
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
        // Orden por defecto: más recientes primero
        query = query.order('admission_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener hospitalizaciones: ${error.message}`)
      }

      return data as Hospitalization[]
    },
    enabled: !!currentTenant?.id,
  })
}
