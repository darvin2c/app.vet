'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Database } from '@/types/supabase.types'
import useDeletePatient from '@/hooks/patients/use-delete-patient'

type Patient = Database['public']['Tables']['patients']['Row']

interface PatientDeleteProps {
  patient: Patient
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientDelete({
  patient,
  open,
  onOpenChange,
}: PatientDeleteProps) {
  const deletePatient = useDeletePatient()

  const handleConfirm = async () => {
    await deletePatient.mutateAsync(patient.id)
    onOpenChange(false)
  }

  const patientName = `${patient.first_name} ${patient.last_name}`

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onConfirm={handleConfirm}
      title="Eliminar Paciente"
      description={`¿Estás seguro de que deseas eliminar al paciente "${patientName}"? Esta acción no se puede deshacer y se perderán todos los datos asociados.`}
      confirmText="ELIMINAR"
      isLoading={deletePatient.isPending}
    />
  )
}
