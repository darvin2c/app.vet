'use client'

import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { AppointmentCreate } from './appointment-create'
import { useState } from 'react'

type AppointmentCreateButtonProps = {
  onSuccess?: () => void
  petId?: string
} & ResponsiveButtonProps

export function AppointmentCreateButton({
  onSuccess,
  petId,
  ...props
}: AppointmentCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        onClick={() => setOpen(true)}
        variant="default"
        size="sm"
        {...props}
      >
        Nueva Cita
      </ResponsiveButton>

      <AppointmentCreate
        open={open}
        onOpenChange={setOpen}
        onSuccess={onSuccess}
        defaultPetId={petId}
      />
    </>
  )
}
