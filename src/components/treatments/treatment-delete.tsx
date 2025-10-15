'use client'

import { toast } from 'sonner'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useTreatmentDelete } from '@/hooks/treatments/use-treatment-delete'

interface TreatmentDeleteProps {
  treatmentId: string
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function TreatmentDelete({
  treatmentId,
  isOpen,
  onClose,
  onConfirm,
}: TreatmentDeleteProps) {
  const deleteTreatment = useTreatmentDelete()

  const handleConfirm = async () => {
    try {
      await deleteTreatment.mutateAsync(treatmentId)
      toast.success('Tratamiento eliminado exitosamente')
      onConfirm()
      onClose()
    } catch (error) {
      toast.error('Error al eliminar el tratamiento')
    }
  }

  return (
    <AlertConfirmation
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="¿Eliminar tratamiento?"
      description="Esta acción no se puede deshacer. El tratamiento será eliminado permanentemente."
      confirmText="Eliminar"
      isLoading={deleteTreatment.isPending}
    />
  )
}
