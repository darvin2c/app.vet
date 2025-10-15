'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useSurgeryDelete } from '@/hooks/surgeries/use-surgery-delete'
import { Tables } from '@/types/supabase.types'

interface SurgeryDeleteProps {
  surgery: Tables<'surgeries'>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SurgeryDelete({
  surgery,
  trigger,
  open,
  onOpenChange,
}: SurgeryDeleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const deleteSurgery = useSurgeryDelete()

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setIsOpen(open)
    }
  }

  const handleConfirm = async () => {
    try {
      await deleteSurgery.mutateAsync(surgery.id)
      toast.success('Cirugía eliminada exitosamente')
      handleOpenChange(false)
    } catch (error) {
      toast.error('Error al eliminar la cirugía')
      console.error('Error deleting surgery:', error)
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
        title="Eliminar Cirugía"
        description={
          <div className="space-y-2">
            <p>
              Esta acción eliminará permanentemente el registro de la cirugía.
            </p>
            <p className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer.
            </p>
          </div>
        }
        confirmText="eliminar"
        isLoading={deleteSurgery.isPending}
      />
    </>
  )
}
