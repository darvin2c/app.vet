'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useMedicalRecordItemDelete } from '@/hooks/medical-record-items/use-medical-record-item-delete'
import { Tables } from '@/types/supabase.types'

interface MedicalRecordItemDeleteProps {
  medicalRecordItem: Tables<'record_items'>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function MedicalRecordItemDelete({
  medicalRecordItem,
  trigger,
  open,
  onOpenChange,
}: MedicalRecordItemDeleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const deleteMedicalRecordItem = useMedicalRecordItemDelete()

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setIsOpen(open)
    }
  }

  const handleConfirm = async () => {
    try {
      await deleteMedicalRecordItem.mutateAsync(medicalRecordItem.id)
      toast.success('Artículo de registro médico eliminado exitosamente')
      handleOpenChange(false)
    } catch (error) {
      toast.error('Error al eliminar el artículo de registro médico')
      console.error('Error deleting medical record item:', error)
    }
  }

  const isControlled = open !== undefined && onOpenChange !== undefined
  const alertOpen = isControlled ? open : isOpen

  return (
    <>
      {trigger && <div onClick={() => handleOpenChange(true)}>{trigger}</div>}
      <AlertConfirmation
        isOpen={alertOpen}
        onClose={() => handleOpenChange(false)}
        onConfirm={handleConfirm}
        title="Eliminar Artículo de Registro Médico"
        description={
          <div className="space-y-2">
            <p>
              Esta acción eliminará permanentemente el artículo del registro
              médico.
            </p>
            <p className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer.
            </p>
          </div>
        }
        confirmText="eliminar"
        isLoading={deleteMedicalRecordItem.isPending}
      />
    </>
  )
}
