'use client'

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
    await deleteClinicalParameter.mutateAsync(clinicalParameterId)
    onConfirm?.()
    onClose()
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
