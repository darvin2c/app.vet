'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useSpeciesDelete } from '@/hooks/species/use-species-delete'
import { Tables } from '@/types/supabase.types'

interface SpeciesDeleteProps {
  species: Tables<'species'>
  onSuccess?: () => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SpeciesDelete({
  species,
  onSuccess,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: SpeciesDeleteProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen
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
      <AlertConfirmation
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="Eliminar Especie"
        description={
          <div className="space-y-2">
            <p>
              ¿Estás seguro de que deseas eliminar la especie
              <span className="font-bold">{species.name}</span>?
            </p>
            <p className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer. No podrás eliminar la especie si
              tiene razas asociadas.
            </p>
          </div>
        }
        confirmText={'ELIMINAR'}
        isLoading={deleteSpecies.isPending}
      />
    </>
  )
}
