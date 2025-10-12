'use client'

import { useState } from 'react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { Plus } from 'lucide-react'
import { AppointmentTypeCreate } from './appointment-type-create'

interface AppointmentTypeCreateButtonProps {
  onSuccess?: () => void
}

export function AppointmentTypeCreateButton({
  onSuccess,
}: AppointmentTypeCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton size="sm" icon={Plus} onClick={() => setOpen(true)}>
        Nuevo Tipo
      </ResponsiveButton>
      <AppointmentTypeCreate
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) {
            onSuccess?.()
          }
        }}
      />
    </>
  )
}
