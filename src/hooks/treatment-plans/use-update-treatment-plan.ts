import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TreatmentPlanUpdate } from '@/schemas/treatment-plans.schema'
import { toast } from 'sonner'

export default function useUpdateTreatmentPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TreatmentPlanUpdate) => {
      const { id, items, ...updateData } = data

      console.log('🔧 Hook useUpdateTreatmentPlan - Datos recibidos:', data)

      const { data: treatmentPlan, error } = await supabase
        .from('treatment_plans')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(
          `Error al actualizar plan de tratamiento: ${error.message}`
        )
      }

      // Si hay items, manejar la actualización de items
      if (items && items.length > 0) {
        console.log('📋 Actualizando items del plan:', items)

        // Primero, obtener los items existentes
        const { data: existingItems, error: fetchError } = await supabase
          .from('treatment_plan_items')
          .select('id')
          .eq('plan_id', id)

        if (fetchError) {
          console.error('❌ Error al obtener items existentes:', fetchError)
          throw new Error(
            `Error al obtener items existentes: ${fetchError.message}`
          )
        }

        // Eliminar todos los items existentes
        if (existingItems && existingItems.length > 0) {
          const { error: deleteError } = await supabase
            .from('treatment_plan_items')
            .delete()
            .eq('plan_id', id)

          if (deleteError) {
            console.error('❌ Error al eliminar items existentes:', deleteError)
            throw new Error(
              `Error al eliminar items existentes: ${deleteError.message}`
            )
          }
        }

        // Insertar los nuevos items
        const itemsToInsert = items.map((item: any) => ({
          ...item,
          plan_id: id,
          tenant_id: treatmentPlan.tenant_id,
        }))

        const { error: itemsError } = await supabase
          .from('treatment_plan_items')
          .insert(itemsToInsert)

        if (itemsError) {
          console.error('❌ Error al crear nuevos items:', itemsError)
          throw new Error(
            `Error al actualizar items del plan: ${itemsError.message}`
          )
        }

        console.log('✅ Items del plan actualizados exitosamente')
      }

      return treatmentPlan
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] })
      queryClient.invalidateQueries({ queryKey: ['treatment-plan'] })
      queryClient.invalidateQueries({ queryKey: ['patient-treatment-plans'] })
      queryClient.invalidateQueries({ queryKey: ['treatment-plan-items'] })
      toast.success('Plan de tratamiento actualizado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar el plan de tratamiento')
    },
  })
}
