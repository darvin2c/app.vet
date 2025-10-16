'use client'

import { toast } from 'sonner'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useDeleteHospitalization } from '@/hooks/hospitalizations/use-hospitalization-delete'

interface HospitalizationDeleteProps {
  hospitalizationId: string
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function HospitalizationDelete({
  hospitalizationId,
  isOpen,
  onClose,
  onConfirm,
}: HospitalizationDeleteProps) {
  const deleteHospitalization = useDeleteHospitalization()

  const handleConfirm = async () => {
    try {
      await deleteHospitalization.mutateAsync(hospitalizationId)
      toast.success('Hospitalización eliminada exitosamente')
      onConfirm()
      onClose()
    } catch (error) {
      toast.error('Error al eliminar la hospitalización')
    }
  }

  return (
    <AlertConfirmation
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="¿Eliminar hospitalización?"
      description="Esta acción no se puede deshacer. La hospitalización será eliminada permanentemente."
      confirmText="Eliminar"
      isLoading={deleteHospitalization.isPending}
    />
  )
}