'use client'

import { useState } from 'react'
import { usePetDelete } from '@/hooks/pets/use-pet-delete'
import { Tables } from '@/types/supabase.types'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'

interface PetDeleteProps {
  pet: Tables<'pets'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PetDelete({ pet, open, onOpenChange }: PetDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { mutateAsync: deletePet } = usePetDelete()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deletePet(pet.id)
      onOpenChange(false)
    } catch (error) {
      console.error('Error al eliminar mascota:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Eliminar Mascota"
      description={`¿Estás seguro de que deseas eliminar a ${pet.name}? Esta acción no se puede deshacer.`}
      confirmText={pet.name}
      onConfirm={handleDelete}
      isLoading={isDeleting}
    />
  )
}