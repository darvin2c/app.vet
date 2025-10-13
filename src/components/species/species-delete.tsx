'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { useSpeciesDelete } from '@/hooks/species/use-species-delete'
import { Tables } from '@/types/supabase.types'
import { Trash2 } from 'lucide-react'

interface SpeciesDeleteProps {
  species: Tables<'species'>
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function SpeciesDelete({
  species,
  onSuccess,
  trigger,
}: SpeciesDeleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const deleteSpecies = useSpeciesDelete()

  const handleConfirm = async () => {
    try {
      await deleteSpecies.mutateAsync(species.id)
      toast.success('Especie eliminada exitosamente')
      setIsOpen(false)
      onSuccess?.()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al eliminar la especie'
      )
    }
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <ResponsiveButton
          variant="ghost"
          size="sm"
          icon={Trash2}
          tooltip="Eliminar especie"
          onClick={() => setIsOpen(true)}
        >
          Eliminar
        </ResponsiveButton>
      )}

      <AlertConfirmation
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="Eliminar Especie"
        description={
          <div className="space-y-2">
            <p>
              ¿Estás seguro de que deseas eliminar la especie &quot;
              {species.name}&quot;?
            </p>
            <p className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer. No podrás eliminar la especie si
              tiene razas asociadas.
            </p>
          </div>
        }
        confirmText={species.name}
        isLoading={deleteSpecies.isPending}
      />
    </>
  )
}
