'use client'

import { toast } from 'sonner'
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
    try {
      await deleteBreed.mutateAsync(breed.id)
      toast.success('Raza eliminada exitosamente')
      onOpenChange(false)
    } catch (error) {
      console.error('Error al eliminar raza:', error)
      toast.error('Error al eliminar la raza')
    }
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Eliminar Raza"
      description={`¿Estás seguro de que deseas eliminar la raza "${breed.name}"? Esta acción no se puede deshacer.`}
      confirmText="eliminar"
      onConfirm={handleDelete}
      isLoading={deleteBreed.isPending}
    />
  )
}
