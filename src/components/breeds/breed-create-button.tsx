'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { BreedCreate } from './breed-create'

export function BreedCreateButton({
  selectedSpeciesId,
  children,
  ...props
}: ResponsiveButtonProps & {
  selectedSpeciesId?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton onClick={() => setOpen(true)} {...props}>
        <Plus className="h-4 w-4" />
        {children || 'Nueva'}
      </ResponsiveButton>

      <BreedCreate
        open={open}
        onOpenChange={setOpen}
        selectedSpeciesId={selectedSpeciesId}
      />
    </>
  )
}
