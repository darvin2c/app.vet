'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Database } from '@/types/supabase.types'
import useDeleteSpecialty from '@/hooks/specialties/use-delete-specialty'

type Specialty = Database['public']['Tables']['specialties']['Row']

interface SpecialtyDeleteProps {
  specialty: Specialty
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SpecialtyDelete({
  specialty,
  open,
  onOpenChange,
}: SpecialtyDeleteProps) {
  const deleteSpecialty = useDeleteSpecialty()

  const handleConfirm = async () => {
    await deleteSpecialty.mutateAsync(specialty.id)
    onOpenChange(false)
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onConfirm={handleConfirm}
      title="Eliminar Especialidad"
      description={`¿Estás seguro de que deseas eliminar la especialidad "${specialty.name}"? Esta acción no se puede deshacer y se perderán todos los datos asociados.`}
      confirmText="ELIMINAR"
      isLoading={deleteSpecialty.isPending}
    />
  )
}
