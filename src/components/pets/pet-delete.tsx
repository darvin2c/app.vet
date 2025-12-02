'use client'

import { useDeletePet } from '@/hooks/pets/use-pet-delete'
import { Tables } from '@/types/supabase.types'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'

interface PetDeleteProps {
  pet: Tables<'pets'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PetDelete({ pet, open, onOpenChange }: PetDeleteProps) {
  const { mutate: deletePet, isPending: isDeleting } = useDeletePet()

  const handleDelete = () => {
    deletePet(pet.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
      onError: (error) => {
        console.error('Error al eliminar mascota:', error)
      },
    })
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Eliminar Mascota"
      description={`¿Estás seguro de que deseas eliminar a ${pet.name}? Esta acción no se puede deshacer.`}
      confirmText="ELIMINAR"
      onConfirm={handleDelete}
      isLoading={isDeleting}
    />
  )
}
