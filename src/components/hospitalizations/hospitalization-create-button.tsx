'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { HospitalizationCreate } from './hospitalization-create'

interface HospitalizationCreateButtonProps {
  petId: string
}

export function HospitalizationCreateButton({ petId }: HospitalizationCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        tooltip="Nueva Hospitalización"
        onClick={() => setOpen(true)}
      >
        Nueva Hospitalización
      </ResponsiveButton>

      <HospitalizationCreate open={open} onOpenChange={setOpen} petId={petId} />
    </>
  )
}