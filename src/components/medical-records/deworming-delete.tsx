'use client'

import { useState } from 'react'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useDewormingDelete } from '@/hooks/dewormings/use-deworming-delete'
import { Tables } from '@/types/supabase.types'

interface DewormingDeleteProps {
  deworming: Tables<'pet_dewormings'>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DewormingDelete({
  deworming,
  trigger,
  open,
  onOpenChange,
}: DewormingDeleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const deleteDeworming = useDewormingDelete()

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setIsOpen(open)
    }
  }

  const handleConfirm = async () => {
    try {
      await deleteDeworming.mutateAsync(deworming.id)
      handleOpenChange(false)
    } catch (error) {
      // Error handled in hook
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
        title="Eliminar Desparasitación"
        description={
          <div className="space-y-2">
            <p>
              Esta acción eliminará permanentemente el registro de desparasitación.
            </p>
            <p className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer.
            </p>
          </div>
        }
        confirmText="Eliminar"
        isLoading={deleteDeworming.isPending}
      />
    </>
  )
}
