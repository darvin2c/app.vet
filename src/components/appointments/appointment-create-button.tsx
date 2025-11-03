'use client'

import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { AppointmentCreate } from './appointment-create'

type AppointmentCreateButtonProps = {
  onSuccess?: () => void
  petId?: string
} & ResponsiveButtonProps

export function AppointmentCreateButton({
  onSuccess,
  petId,
  ...props
}: AppointmentCreateButtonProps) {
  return (
    <AppointmentCreate
      onSuccess={onSuccess}
      defaultPetId={petId}
      trigger={
        <ResponsiveButton variant="default" size="sm" icon={Plus} {...props}>
          Nueva Cita
        </ResponsiveButton>
      }
    />
  )
}
