'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useBreedDelete } from '@/hooks/breeds/use-breed-delete'
import { Tables } from '@/types/supabase.types'

interface BreedDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  breed: Tables<'breeds'>
}

export function BreedDelete({ open, onOpenChange, breed }: BreedDeleteProps) {
  const deleteBreed = useBreedDelete()

  const handleDelete = async () => {
    await deleteBreed.mutateAsync(breed.id)
    onOpenChange(false)
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Eliminar Raza"
      description={`¿Estás seguro de que deseas eliminar la raza "${breed.name}"? Esta acción no se puede deshacer.`}
      confirmText="ELIMINAR"
      onConfirm={handleDelete}
      isLoading={deleteBreed.isPending}
    />
  )
}
