import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/types/order-by.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

type MedicalRecord = Tables<'clinical_records'> & {
  pets: Tables<'pets'> | null
  staff: Tables<'staff'> | null
  appointments: Tables<'appointments'> | null
}

interface UseMedicalRecordListParams {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
}

export function useMedicalRecordList(params?: UseMedicalRecordListParams) {
  const { filters = [], search, orders = [] } = params || {}
  const { currentTenant } = useCurrentTenantStore()
  const supabase = createClient()

  return useQuery({
    queryKey: [currentTenant?.id, 'clinical_records', filters, search, orders],
    queryFn: async () => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('clinical_records')
        .select(
          `
          *,
          pets (
            id,
            name,
            microchip
          ),
          staff (
            id,
            first_name,
            last_name
          ),
          appointments (
            id,
            scheduled_start,
            reason
          )
        `
        )
        .eq('tenant_id', currentTenant.id)

      // Aplicar búsqueda
      if (search) {
        query = query.or(
          `notes.ilike.%${search}%,pets.name.ilike.%${search}%,pets.microchip.ilike.%${search}%`
        )
      }

      // Aplicar filtros
      filters.forEach((filter) => {
        switch (filter.field) {
          case 'pet_id':
            query = query.eq('pet_id', filter.value)
            break
          case 'record_type':
            query = query.eq('record_type', filter.value)
            break
          case 'status':
            query = query.eq('status', filter.value)
            break
          case 'vet_id':
            query = query.eq('vet_id', filter.value)
            break
          case 'date_from':
            query = query.gte('record_date', filter.value)
            break
          case 'date_to':
            query = query.lte('record_date', filter.value)
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
        throw new Error(`Error al obtener registros médicos: ${error.message}`)
      }

      return data as MedicalRecord[]
    },
    enabled: !!currentTenant?.id,
  })
}
