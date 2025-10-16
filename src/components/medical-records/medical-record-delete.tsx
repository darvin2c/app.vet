'use client'

import { toast } from 'sonner'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useMedicalRecordDelete } from '@/hooks/medical-records/use-medical-record-delete'

interface MedicalRecordDeleteProps {
  medicalRecordId: string
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
}

export function MedicalRecordDelete({
  medicalRecordId,
  isOpen,
  onClose,
  onConfirm,
}: MedicalRecordDeleteProps) {
  const deleteMedicalRecord = useMedicalRecordDelete()

  const handleDelete = async () => {
    try {
      await deleteMedicalRecord.mutateAsync(medicalRecordId)
      toast.success('Registro médico eliminado exitosamente')
      if (onConfirm) onConfirm()
      onClose()
    } catch (error) {
      toast.error('Error al eliminar el registro médico')
    }
  }

  return (
    <AlertConfirmation
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="¿Eliminar registro médico?"
      description="Esta acción no se puede deshacer. El registro médico será eliminado permanentemente."
      confirmText="Eliminar"
      isLoading={deleteMedicalRecord.isPending}
    />
  )
}
