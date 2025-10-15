'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { TreatmentItemCreate } from './treatment-item-create'

interface TreatmentItemCreateButtonProps {
  treatmentId: string
}

export function TreatmentItemCreateButton({
  treatmentId,
}: TreatmentItemCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        size="sm"
        icon={Plus}
        tooltip="Nuevo Item"
        onClick={() => setOpen(true)}
      >
        Nuevo Item
      </ResponsiveButton>

      <TreatmentItemCreate
        open={open}
        onOpenChange={setOpen}
        treatmentId={treatmentId}
      />
    </>
  )
}
