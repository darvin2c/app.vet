import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { TreatmentPlanWithRelations } from './use-treatment-plans'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

export default function usePatientTreatmentPlans(patientId: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['patient-treatment-plans', patientId, currentTenant?.id],
    queryFn: async () => {
      if (!patientId || !currentTenant?.id) {
        throw new Error('ID de paciente y tenant requeridos')
      }

      const { data: treatmentPlans, error } = await supabase
        .from('treatment_plans')
        .select(
          `
          *,
          patients(id, first_name, last_name, email, phone),
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
        .eq('patient_id', patientId)
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(
          `Error al obtener planes del paciente: ${error.message}`
        )
      }

      return treatmentPlans as TreatmentPlanWithRelations[]
    },
    enabled: !!patientId && !!currentTenant?.id,
  })
}
