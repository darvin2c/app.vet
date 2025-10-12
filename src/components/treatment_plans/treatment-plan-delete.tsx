'use client'

import { useState } from 'react'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { TreatmentPlanWithRelations } from '@/hooks/treatment-plans/use-treatment-plans'
import useDeleteTreatmentPlan from '@/hooks/treatment-plans/use-delete-treatment-plan'

interface TreatmentPlanDeleteProps {
  treatmentPlan: TreatmentPlanWithRelations
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function TreatmentPlanDelete({
  treatmentPlan,
  open,
  onOpenChange,
  onSuccess,
}: TreatmentPlanDeleteProps) {
  const [confirmText, setConfirmText] = useState('')
  const deleteTreatmentPlan = useDeleteTreatmentPlan()

  const handleConfirm = async () => {
    if (confirmText.toLowerCase() === 'eliminar') {
      await deleteTreatmentPlan.mutateAsync(treatmentPlan.id)
      onSuccess?.()
      onOpenChange(false)
      setConfirmText('')
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setConfirmText('')
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Eliminar Plan de Tratamiento"
      description={`¿Estás seguro de que deseas eliminar el plan de tratamiento "${treatmentPlan.title}"? Esta acción no se puede deshacer. Se eliminarán todos los procedimientos asociados al plan.`}
      confirmText="eliminar"
      onConfirm={handleConfirm}
      isLoading={deleteTreatmentPlan.isPending}
    />
  )
}
