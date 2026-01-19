'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useAppointmentDelete } from '@/hooks/appointments/use-appointment-delete'
import type { Tables } from '@/types/supabase.types'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Appointment = Tables<'appointments'> & {
  pets?: { name: string; customer_id: string } | null
}

interface AppointmentDeleteProps {
  appointment: Appointment
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AppointmentDelete({
  appointment,
  open,
  onOpenChange,
  onSuccess,
}: AppointmentDeleteProps) {
  const deleteAppointment = useAppointmentDelete()

  const handleDelete = async () => {
    try {
      await deleteAppointment.mutateAsync(appointment.id)
      toast.success('Cita eliminada exitosamente')
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast.error('Error al eliminar la cita')
      console.error('Error deleting appointment:', error)
    }
  }

  const patientName = appointment.pets
    ? appointment.pets.name
    : 'Paciente no especificado'

  const appointmentDate = format(
    new Date(appointment.scheduled_start),
    'dd/MM/yyyy HH:mm',
    { locale: es }
  )

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Eliminar Cita"
      description={`¿Estás seguro de que deseas eliminar la cita del paciente ${patientName} programada para ${appointmentDate}? Esta acción no se puede deshacer.`}
      confirmText="ELIMINAR"
      onConfirm={handleDelete}
      isLoading={deleteAppointment.isPending}
    />
  )
}
