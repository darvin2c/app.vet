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
  petId: string
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
}

export function useMedicalRecordList({
  petId,
  filters = [],
  search,
  orders = [
    {
      field: 'created_at',
      direction: 'desc',
      ascending: false,
    },
  ],
}: UseMedicalRecordListParams) {
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
          clinical_pars (
            id,
            params,
            schema_version, 
            measured_at
          ),
          clinical_notes (
            id, 
            note
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
        .eq('pet_id', petId)

      // Aplicar búsqueda
      if (search) {
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
        throw new Error(`Error al obtener registros médicos: ${error.message}`)
      }

      return data
    },
    enabled: !!currentTenant?.id,
  })
}
