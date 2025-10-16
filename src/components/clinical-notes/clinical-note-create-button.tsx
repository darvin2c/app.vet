'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ClinicalNoteCreate } from './clinical-note-create'

interface ClinicalNoteCreateButtonProps {
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
      >
        <Plus className="h-4 w-4" />
        Nueva Nota Clínica
      </ResponsiveButton>

      <ClinicalNoteCreate
        open={open}
        onOpenChange={setOpen}
        medicalRecordId={medicalRecordId}
        hospitalizationId={hospitalizationId}
      />
    </>
  )
}
