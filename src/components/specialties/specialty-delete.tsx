'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Tables } from '@/types/supabase.types'
import useSpecialtyDelete from '@/hooks/specialties/use-specialty-delete'

interface SpecialtyDeleteProps {
  specialty: Tables<'specialties'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SpecialtyDelete({
  specialty,
  open,
  onOpenChange,
}: SpecialtyDeleteProps) {
  const deleteSpecialty = useSpecialtyDelete()

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
      description={
        <>
          ¿Estás seguro de que deseas eliminar la especialidad{' '}
          <strong>{specialty.name}</strong>? Esta acción no se puede deshacer y
          se perderán todos los datos asociados.
        </>
      }
      confirmText="ELIMINAR"
      isLoading={deleteSpecialty.isPending}
    />
  )
}
