'use client'

import { useState } from 'react'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { useDeleteTreatmentPlanItem } from '@/hooks/treatment-plans/use-treatment-plan-items'
import { Tables } from '@/types/supabase.types'
import { Trash2 } from 'lucide-react'

type TreatmentPlanItem = Tables<'treatment_plan_items'>

interface TreatmentPlanItemDeleteProps {
  trigger?: React.ReactNode
  item: TreatmentPlanItem
  onSuccess?: () => void
}

export function TreatmentPlanItemDelete({
  trigger,
  item,
  onSuccess,
}: TreatmentPlanItemDeleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const deleteTreatmentPlanItem = useDeleteTreatmentPlanItem()

  const handleConfirm = async () => {
    try {
      await deleteTreatmentPlanItem.mutateAsync(item.id)
      setIsOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error al eliminar procedimiento:', error)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {trigger || (
          <ResponsiveButton icon={Trash2} size="sm" variant="destructive">
            Eliminar
          </ResponsiveButton>
        )}
      </div>

      <AlertConfirmation
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Eliminar Procedimiento"
        description={`¿Estás seguro de que deseas eliminar este procedimiento del plan de tratamiento? Esta acción no se puede deshacer. Para confirmar, escribe "ELIMINAR" en el campo de abajo.`}
        confirmText="ELIMINAR"
        isLoading={deleteTreatmentPlanItem.isPending}
      />
    </>
  )
}
