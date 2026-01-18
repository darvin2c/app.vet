'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { SpeciesForm } from './species-form'
import { speciesCreateSchema } from '@/schemas/species.schema'
import { useSpeciesCreate } from '@/hooks/species/use-species-create'
import CanAccess from '@/components/ui/can-access'

interface SpeciesCreateProps {
  onSuccess?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SpeciesCreate({
  onSuccess,
  open,
  onOpenChange,
}: SpeciesCreateProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = open !== undefined ? open : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const createSpecies = useSpeciesCreate()

  const form = useForm({
    resolver: zodResolver(speciesCreateSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await createSpecies.mutateAsync(data)
    form.reset()
    setOpen(false)
    onSuccess?.()
  })

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={isOpen}
        onOpenChange={setOpen as any}
        title="Crear Nueva Especie"
        description="Agrega una nueva especie al sistema. Las especies pueden tener múltiples razas asociadas."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={createSpecies.isPending}
        submitLabel="Crear Especie"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <SpeciesForm />
      </FormSheet>
    </CanAccess>
  )
}
