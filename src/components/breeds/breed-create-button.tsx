'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { BreedCreate } from './breed-create'

interface BreedCreateButtonProps {
  selectedSpeciesId?: string
}

export function BreedCreateButton({
  selectedSpeciesId,
}: BreedCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Nueva Raza
      </ResponsiveButton>

      <BreedCreate
        open={open}
        onOpenChange={setOpen}
        selectedSpeciesId={selectedSpeciesId}
      />
    </>
  )
}
