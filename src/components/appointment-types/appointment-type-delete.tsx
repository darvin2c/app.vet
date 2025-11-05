'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useAppointmentTypeDelete } from '@/hooks/appointment-types/use-appointment-type-delete'
import type { Tables } from '@/types/supabase.types'

interface AppointmentTypeDeleteProps {
  appointmentType: Tables<'appointment_types'>
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AppointmentTypeDelete({
  appointmentType,
  open,
  onOpenChange,
  onSuccess,
}: AppointmentTypeDeleteProps) {
  const deleteMutation = useAppointmentTypeDelete()

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(appointmentType.id)
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      // El error ya es manejado por el hook useAppointmentTypeDelete
    }
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Eliminar Tipo de Cita"
      description={`¿Estás seguro de que deseas eliminar el tipo de cita "${appointmentType.name}"? Esta acción no se puede deshacer.`}
      confirmText="ELIMINAR"
      onConfirm={handleDelete}
      isLoading={deleteMutation.isPending}
    />
  )
}
