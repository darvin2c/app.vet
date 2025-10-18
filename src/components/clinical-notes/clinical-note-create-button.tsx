'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ClinicalNoteCreate } from './clinical-note-create'

interface ClinicalNoteCreateButtonProps {
  petId?: string
  medicalRecordId?: string
  hospitalizationId?: string
  variant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function ClinicalNoteCreateButton({
  petId,
  medicalRecordId,
  hospitalizationId,
  variant = 'default',
  size = 'default',
}: ClinicalNoteCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        onClick={() => setOpen(true)}
        variant={variant}
        size={size}
        icon={Plus}
      >
        Nueva Nota Clínica
      </ResponsiveButton>

      <ClinicalNoteCreate
        open={open}
        onOpenChange={setOpen}
        petId={petId}
        medicalRecordId={medicalRecordId}
        hospitalizationId={hospitalizationId}
      />
    </>
  )
}
