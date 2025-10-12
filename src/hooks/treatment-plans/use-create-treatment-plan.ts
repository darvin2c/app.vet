import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TreatmentPlanCreate } from '@/schemas/treatment-plans.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useCreateTreatmentPlan() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: TreatmentPlanCreate) => {
      console.log('🔧 Hook useCreateTreatmentPlan - Datos recibidos:', data)
      console.log('🏢 Tenant actual:', currentTenant)

      if (!currentTenant?.id) {
        console.error('❌ No hay tenant seleccionado')
        throw new Error('No hay tenant seleccionado')
      }

      // Separar los items del plan principal
      const { items, ...planData } = data

      const insertData = {
        ...planData,
        tenant_id: currentTenant.id,
      }

      console.log('📤 Datos del plan a insertar en Supabase:', insertData)

      const { data: treatmentPlan, error } = await supabase
        .from('treatment_plans')
        .insert(insertData)
        .select()
        .single()

      console.log('📥 Respuesta de Supabase para plan:', {
        treatmentPlan,
        error,
      })

      if (error) {
        console.error('❌ Error de Supabase al crear plan:', error)
        throw new Error(`Error al crear plan de tratamiento: ${error.message}`)
      }

      // Si hay items, crearlos
      if (items && items.length > 0) {
        console.log('📋 Creando items del plan:', items)

        const itemsToInsert = items.map((item: any) => ({
          ...item,
          plan_id: treatmentPlan.id,
          tenant_id: currentTenant.id,
        }))

        const { error: itemsError } = await supabase
          .from('treatment_plan_items')
          .insert(itemsToInsert)

        if (itemsError) {
          console.error('❌ Error al crear items del plan:', itemsError)
          // Si falla la creación de items, eliminar el plan creado
          await supabase
            .from('treatment_plans')
            .delete()
            .eq('id', treatmentPlan.id)
          throw new Error(
            `Error al crear items del plan: ${itemsError.message}`
          )
        }

        console.log('✅ Items del plan creados exitosamente')
      }

      return treatmentPlan
    },
    onSuccess: (data) => {
      console.log('✅ Mutación exitosa:', data)
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] })
      queryClient.invalidateQueries({ queryKey: ['patient-treatment-plans'] })
      queryClient.invalidateQueries({ queryKey: ['treatment-plan-items'] })
      toast.success('Plan de tratamiento creado exitosamente')
    },
    onError: (error) => {
      console.error('❌ Error en mutación:', error)
      toast.error(error.message || 'Error al crear el plan de tratamiento')
    },
  })
}
