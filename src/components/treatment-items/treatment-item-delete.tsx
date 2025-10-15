'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useTreatmentItemDelete } from '@/hooks/treatment-items/use-treatment-item-delete'
import { Tables } from '@/types/supabase.types'

interface TreatmentItemDeleteProps {
  treatmentItem: Tables<'treatment_items'>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TreatmentItemDelete({
  treatmentItem,
  trigger,
  open,
  onOpenChange,
}: TreatmentItemDeleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const deleteTreatmentItem = useTreatmentItemDelete()

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setIsOpen(open)
    }
  }

  const handleConfirm = async () => {
    try {
      await deleteTreatmentItem.mutateAsync(treatmentItem.id)
      toast.success('Artículo de tratamiento eliminado exitosamente')
      handleOpenChange(false)
    } catch (error) {
      toast.error('Error al eliminar el artículo de tratamiento')
      console.error('Error deleting treatment item:', error)
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
        title="Eliminar Artículo de Tratamiento"
        description={
          <div className="space-y-2">
            <p>
              Esta acción eliminará permanentemente el artículo del tratamiento.
            </p>
            <p className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer.
            </p>
          </div>
        }
        confirmText="eliminar"
        isLoading={deleteTreatmentItem.isPending}
      />
    </>
  )
}
