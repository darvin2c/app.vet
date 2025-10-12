import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { TreatmentPlanWithRelations } from './use-treatment-plans'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

export default function useClientTreatmentPlans(clientId: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['client-treatment-plans', clientId, currentTenant?.id],
    queryFn: async () => {
      if (!clientId || !currentTenant?.id) {
        throw new Error('ID de cliente y tenant requeridos')
      }

      const { data: treatmentPlans, error } = await supabase
        .from('treatment_plans')
        .select(
          `
          *,
          clients(id, first_name, last_name, email, phone),
          staff(id, first_name, last_name),
          treatment_plan_items(
            id,
            procedure_id,
            quantity,
            unit_price,
            total,
            status,
            description,
            procedures(id, name, code, base_price)
          )
        `
        )
        .eq('client_id', clientId)
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(
          `Error al obtener planes del cliente: ${error.message}`
        )
      }

      return treatmentPlans as TreatmentPlanWithRelations[]
    },
    enabled: !!clientId && !!currentTenant?.id,
  })
}
