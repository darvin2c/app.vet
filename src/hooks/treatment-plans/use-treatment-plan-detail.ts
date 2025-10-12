import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { TreatmentPlanWithRelations } from './use-treatment-plans'

export default function useTreatmentPlanDetail(id: string) {
  return useQuery({
    queryKey: ['treatment-plan', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('ID de plan de tratamiento requerido')
      }

      const { data: treatmentPlan, error } = await supabase
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
        .eq('id', id)
        .single()

      if (error) {
        throw new Error(
          `Error al obtener plan de tratamiento: ${error.message}`
        )
      }

      return treatmentPlan as TreatmentPlanWithRelations
    },
    enabled: !!id,
  })
}
