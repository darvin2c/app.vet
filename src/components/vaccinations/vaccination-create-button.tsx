'use client'

import { useState } from 'react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { VaccinationCreate } from './vaccination-create'
import { Plus } from 'lucide-react'

interface VaccinationCreateButtonProps {
  medicalRecordId: string
}

export function VaccinationCreateButton({
  medicalRecordId,
}: VaccinationCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        onClick={() => setOpen(true)}
        size="sm"
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Nueva Vacunación
      </ResponsiveButton>
      <VaccinationCreate
        open={open}
        onOpenChange={setOpen}
        medicalRecordId={medicalRecordId}
      />
    </>
  )
}
