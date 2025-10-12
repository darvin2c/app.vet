'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useDeleteAppointmentType } from '@/hooks/appointment-types/use-delete-appointment-type'
import { toast } from 'sonner'
import type { Tables } from '@/types/supabase.types'

type AppointmentType = Tables<'appointment_types'>

interface AppointmentTypeDeleteProps {
  appointmentType: AppointmentType
  onSuccess?: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppointmentTypeDelete({
  appointmentType,
  onSuccess,
  open,
  onOpenChange,
}: AppointmentTypeDeleteProps) {
  const { mutate: deleteAppointmentType, isPending } =
    useDeleteAppointmentType()

  const handleDelete = () => {
    deleteAppointmentType(appointmentType.id, {
      onSuccess: () => {
        toast.success('Tipo de cita eliminado correctamente')
        onSuccess?.()
        onOpenChange(false)
      },
      onError: (error: any) => {
        toast.error('Error al eliminar el tipo de cita')
        console.error('Error deleting appointment type:', error)
      },
    })
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="¿Estás seguro?"
      description={`Esta acción eliminará permanentemente el tipo de cita "${appointmentType.name}". Esta acción no se puede deshacer.`}
      confirmText={appointmentType.name}
      onConfirm={handleDelete}
      isLoading={isPending}
    />
  )
}
