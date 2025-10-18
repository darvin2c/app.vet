'use client'

import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { AppointmentCreate } from './appointment-create'

interface AppointmentCreateButtonProps {
  onSuccess?: () => void
  petId?: string
}

export function AppointmentCreateButton({
  onSuccess,
  petId,
}: AppointmentCreateButtonProps) {
  return (
    <AppointmentCreate
      onSuccess={onSuccess}
      defaultPetId={petId}
      trigger={
        <ResponsiveButton variant="default" size="sm" icon={Plus}>
          Nueva Cita
        </ResponsiveButton>
      }
    />
  )
}
