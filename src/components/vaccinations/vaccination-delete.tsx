'use client'

import { toast } from 'sonner'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useVaccinationDelete } from '@/hooks/vaccinations/use-vaccination-delete'

interface VaccinationDeleteProps {
  vaccinationId: string
  isOpen?: boolean
  onClose: () => void
  onConfirm?: () => void
}

export function VaccinationDelete({
  vaccinationId,
  isOpen = false,
  onClose,
  onConfirm,
}: VaccinationDeleteProps) {
  const { mutate: deleteVaccination, isPending } = useVaccinationDelete()

  const handleConfirm = async () => {
    try {
      deleteVaccination(vaccinationId, {
        onSuccess: () => {
          toast.success('Vacunación eliminada exitosamente')
          onConfirm?.()
          onClose()
        },
        onError: () => {
          toast.error('Error al eliminar la vacunación')
        },
      })
    } catch (error) {
      toast.error('Error al eliminar la vacunación')
    }
  }

  return (
    <AlertConfirmation
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Eliminar Vacunación"
      description="¿Estás seguro de que deseas eliminar esta vacunación? Esta acción no se puede deshacer."
      confirmText="ELIMINAR"
      isLoading={isPending}
    />
  )
}
