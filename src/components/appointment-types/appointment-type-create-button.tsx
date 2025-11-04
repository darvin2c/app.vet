'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { AppointmentTypeCreate } from './appointment-type-create'

export function AppointmentTypeCreateButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        variant="default"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Nuevo Tipo de Cita
      </ResponsiveButton>

      <AppointmentTypeCreate open={open} onOpenChange={setOpen} />
    </>
  )
}
