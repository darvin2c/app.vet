'use client'

import { useState } from 'react'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useVaccinationDelete } from '@/hooks/vaccinations/use-vaccination-delete'
import { Tables } from '@/types/supabase.types'

interface VaccinationDeleteProps {
  vaccination: Tables<'vaccinations'>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function VaccinationDelete({
  vaccination,
  trigger,
  open,
  onOpenChange,
}: VaccinationDeleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const deleteVaccination = useVaccinationDelete()

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setIsOpen(open)
    }
  }

  const handleConfirm = async () => {
    try {
      await deleteVaccination.mutateAsync(vaccination.id)
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
        title="Eliminar Vacunación"
        description={
          <div className="space-y-2">
            <p>
              Esta acción eliminará permanentemente el registro de vacunación.
            </p>
            <p className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer.
            </p>
          </div>
        }
        confirmText="Eliminar"
        isLoading={deleteVaccination.isPending}
      />
    </>
  )
}
