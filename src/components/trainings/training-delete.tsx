'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useTrainingDelete } from '@/hooks/trainings/use-training-delete'
import { Tables } from '@/types/supabase.types'

interface TrainingDeleteProps {
  training: Tables<'trainings'>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TrainingDelete({
  training,
  trigger,
  open,
  onOpenChange,
}: TrainingDeleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const deleteTraining = useTrainingDelete()

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setIsOpen(open)
    }
  }

  const handleConfirm = async () => {
    try {
      await deleteTraining.mutateAsync(training.id)
      toast.success('Entrenamiento eliminado exitosamente')
      handleOpenChange(false)
    } catch (error) {
      toast.error('Error al eliminar el entrenamiento')
      console.error('Error deleting training:', error)
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
        title="Eliminar Entrenamiento"
        description={
          <div className="space-y-2">
            <p>
              Esta acción eliminará permanentemente el registro del
              entrenamiento.
            </p>
            <p className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer.
            </p>
          </div>
        }
        confirmText="eliminar"
        isLoading={deleteTraining.isPending}
      />
    </>
  )
}
