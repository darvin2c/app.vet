import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'

type TreatmentPlanItem =
  Database['public']['Tables']['treatment_plan_items']['Row']

export type TreatmentPlanItemWithProcedure = TreatmentPlanItem & {
  procedures?: Database['public']['Tables']['procedures']['Row']
}

export function useTreatmentPlanItemsList(planId: string) {
  return useQuery({
    queryKey: ['treatment-plan-items', planId],
    queryFn: async () => {
      if (!planId) {
        throw new Error('Plan ID es requerido')
      }

      const { data: items, error } = await supabase
        .from('treatment_plan_items')
        .select(
          `
          *,
          procedures(id, name, code, base_price)
        `
        )
        .eq('plan_id', planId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error al obtener items del plan: ${error.message}`)
      }

      return items as TreatmentPlanItemWithProcedure[]
    },
    enabled: !!planId,
  })
}
