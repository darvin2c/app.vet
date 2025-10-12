'use client'

import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { AppointmentCreate } from './appointment-create'

interface AppointmentCreateButtonProps {
  onSuccess?: () => void
}

export function AppointmentCreateButton({
  onSuccess,
}: AppointmentCreateButtonProps) {
  return (
    <AppointmentCreate
      onSuccess={onSuccess}
      trigger={
        <ResponsiveButton variant="default" size="sm" icon={Plus}>
          Nueva Cita
        </ResponsiveButton>
      }
    />
  )
}
