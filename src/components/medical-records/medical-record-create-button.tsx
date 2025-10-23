'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { MedicalRecordCreate } from './medical-record-create'

interface MedicalRecordCreateButtonProps {
  petId: string
}

export function MedicalRecordCreateButton({
  petId,
}: MedicalRecordCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        tooltip="Nuevo Registro Médico"
        onClick={() => setOpen(true)}
      >
        Nuevo Registro Médico
      </ResponsiveButton>
      <MedicalRecordCreate open={open} onOpenChange={setOpen} petId={petId} />
    </>
  )
}
