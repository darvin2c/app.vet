'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface TreatmentPlanItemAddData {
  plan_id: string
  procedure_id: string
  quantity: number
  unit_price: number
  notes?: string
}

export function useTreatmentPlanItemAdd() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TreatmentPlanItemAddData) => {
      const { data: result, error } = await supabase
        .from('treatment_plan_items')
        .insert({
          plan_id: data.plan_id,
          procedure_id: data.procedure_id,
          quantity: data.quantity,
          unit_price: data.unit_price,
          description: data.notes || '',
          status: 'planned',
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return result
    },
    onSuccess: (data) => {
      toast.success('Procedimiento agregado exitosamente')

      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ['treatment-plan-items', data.plan_id],
      })

      queryClient.invalidateQueries({
        queryKey: ['treatment-plan-detail', data.plan_id],
      })

      queryClient.invalidateQueries({
        queryKey: ['treatment-plans'],
      })
    },
    onError: (error) => {
      console.error('Error al agregar procedimiento:', error)
      toast.error('Error al agregar el procedimiento')
    },
  })
}
