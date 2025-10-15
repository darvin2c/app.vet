'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { TrainingCreate } from './training-create'

interface TrainingCreateButtonProps {
  petId: string
}

export function TrainingCreateButton({ petId }: TrainingCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        size="sm"
        icon={Plus}
        tooltip="Nuevo Entrenamiento"
        onClick={() => setOpen(true)}
      >
        Nuevo Entrenamiento
      </ResponsiveButton>

      <TrainingCreate open={open} onOpenChange={setOpen} petId={petId} />
    </>
  )
}
