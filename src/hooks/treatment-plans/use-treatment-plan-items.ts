import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  TreatmentPlanItemCreate,
  TreatmentPlanItemUpdate,
  TreatmentPlanItemStatusUpdate,
} from '@/schemas/treatment-plans.schema'
import { Database } from '@/types/supabase.types'
import { toast } from 'sonner'

type TreatmentPlanItem =
  Database['public']['Tables']['treatment_plan_items']['Row']

export type TreatmentPlanItemWithRelations = TreatmentPlanItem & {
  procedures?: Database['public']['Tables']['procedures']['Row']
}

// Hook para crear item
export function useCreateTreatmentPlanItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TreatmentPlanItemCreate) => {
      const { data: item, error } = await supabase
        .from('treatment_plan_items')
        .insert(data)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear item: ${error.message}`)
      }

      return item
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['treatment-plan', variables.plan_id],
      })
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] })
      toast.success('Procedimiento agregado al plan')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al agregar procedimiento')
    },
  })
}

// Hook para actualizar item
export function useUpdateTreatmentPlanItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TreatmentPlanItemUpdate) => {
      const { id, ...updateData } = data

      const { data: item, error } = await supabase
        .from('treatment_plan_items')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar item: ${error.message}`)
      }

      return item
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plan'] })
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] })
      toast.success('Procedimiento actualizado')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar procedimiento')
    },
  })
}

// Hook para cambiar estado de item
export function useUpdateTreatmentPlanItemStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: { id: string } & TreatmentPlanItemStatusUpdate) => {
      const { data: item, error } = await supabase
        .from('treatment_plan_items')
        .update({
          status: data.status,
          notes: data.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al cambiar estado: ${error.message}`)
      }

      return item
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plan'] })
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] })
      toast.success('Estado actualizado')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al cambiar estado')
    },
  })
}

// Hook para eliminar item
export function useDeleteTreatmentPlanItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('treatment_plan_items')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Error al eliminar item: ${error.message}`)
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plan'] })
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] })
      toast.success('Procedimiento eliminado del plan')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al eliminar procedimiento')
    },
  })
}
