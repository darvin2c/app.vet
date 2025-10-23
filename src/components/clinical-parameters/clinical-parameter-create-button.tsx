'use client'

import { useState } from 'react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ClinicalParameterCreate } from './clinical-parameter-create'
import { Plus } from 'lucide-react'

interface ClinicalParameterCreateButtonProps {
  petId: string
  clinicalRecordId: string
}

export function ClinicalParameterCreateButton({
  petId,
  clinicalRecordId,
}: ClinicalParameterCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        onClick={() => setOpen(true)}
        size="sm"
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Nuevo Parámetro
      </ResponsiveButton>
      <ClinicalParameterCreate
        open={open}
        onOpenChange={setOpen}
        petId={petId}
        clinicalRecordId={clinicalRecordId}
      />
    </>
  )
}
