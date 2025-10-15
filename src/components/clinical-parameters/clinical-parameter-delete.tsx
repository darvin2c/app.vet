'use client'

import { toast } from 'sonner'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useClinicalParameterDelete } from '@/hooks/clinical-parameters/use-clinical-parameter-delete'

interface ClinicalParameterDeleteProps {
  clinicalParameterId: string
  isOpen?: boolean
  onClose: () => void
  onConfirm?: () => void
}

export function ClinicalParameterDelete({
  clinicalParameterId,
  isOpen = false,
  onClose,
  onConfirm,
}: ClinicalParameterDeleteProps) {
  const deleteClinicalParameter = useClinicalParameterDelete()

  const handleConfirm = async () => {
    try {
      await deleteClinicalParameter.mutateAsync(clinicalParameterId)
      toast.success('Parámetros clínicos eliminados exitosamente')
      onConfirm?.()
      onClose()
    } catch (error) {
      toast.error('Error al eliminar los parámetros clínicos')
    }
  }

  return (
    <AlertConfirmation
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Eliminar Parámetros Clínicos"
      description="¿Estás seguro de que deseas eliminar estos parámetros clínicos? Esta acción no se puede deshacer."
      confirmText="ELIMINAR"
      isLoading={deleteClinicalParameter.isPending}
    />
  )
}
