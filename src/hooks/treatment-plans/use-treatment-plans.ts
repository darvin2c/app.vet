import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import { TreatmentPlanFilters } from '@/schemas/treatment-plans.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type TreatmentPlan = Database['public']['Tables']['treatment_plans']['Row']

export type TreatmentPlanWithRelations = TreatmentPlan & {
  patients: {
    id: string
    first_name: string
    last_name: string
    email: string | null
    phone: string | null
  }
  staff: {
    id: string
    first_name: string
    last_name: string
  } | null
  treatment_plan_items?: Array<{
    id: string
    procedure_id: string | null
    quantity: number
    unit_price: number | null
    total: number | null
    status: string
    procedures: {
      id: string
      name: string
      code: string
    } | null
  }>
}

export default function useTreatmentPlans(filters?: TreatmentPlanFilters) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['treatment-plans', currentTenant?.id, filters],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('treatment_plans')
        .select(
          `
          *,
          patients!inner(id, first_name, last_name, email, phone),
          staff(id, first_name, last_name),
          treatment_plan_items(
            id,
            procedure_id,
            quantity,
            unit_price,
            total,
            status,
            procedures(id, name, code)
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters?.client_id) {
      query = query.eq('client_id', filters.client_id)
      }

      if (filters?.staff_id) {
        query = query.eq('staff_id', filters.staff_id)
      }

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.date_from) {
        query = query.gte('created_at', filters.date_from)
      }

      if (filters?.date_to) {
        query = query.lte('created_at', filters.date_to)
      }

      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,diagnosis.ilike.%${filters.search}%`
        )
      }

      const { data, error } = await query

      if (error) {
        throw new Error(
          `Error al obtener planes de tratamiento: ${error.message}`
        )
      }

      return data as TreatmentPlanWithRelations[]
    },
    enabled: !!currentTenant?.id,
  })
}
