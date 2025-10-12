'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { PatientCreate } from './patient-create'

export function PatientCreateButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        tooltip="Nuevo Paciente"
        onClick={() => setOpen(true)}
      >
        Nuevo Paciente
      </ResponsiveButton>

      <PatientCreate open={open} onOpenChange={setOpen} />
    </>
  )
}
