'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { SpeciesForm } from './species-form'
import {
  speciesUpdateSchema,
  type SpeciesUpdate,
} from '@/schemas/species.schema'
import { useSpeciesUpdate } from '@/hooks/species/use-species-update'
import { Tables } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

interface SpeciesEditProps {
  species: Tables<'species'>
  onSuccess?: () => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SpeciesEdit({
  species,
  onSuccess,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: SpeciesEditProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  const updateSpecies = useSpeciesUpdate()

  const form = useForm<SpeciesUpdate>({
    resolver: zodResolver(speciesUpdateSchema),
    defaultValues: {
      name: species.name,
      description: species.description || '',
      is_active: species.is_active,
    },
  })

  // Actualizar valores del formulario cuando cambie la especie
  useEffect(() => {
    form.reset({
      name: species.name,
      description: species.description || '',
      is_active: species.is_active,
    })
  }, [species, form])

  const onSubmit = form.handleSubmit(async (data) => {
    await updateSpecies.mutateAsync({
      id: species.id,
      data,
    })
    setOpen(false)
    onSuccess?.()
    form.reset()
  })

  return (
    <CanAccess resource="products" action="update">
      <FormSheet
        open={open}
        onOpenChange={setOpen as any}
        title="Editar Especie"
        description={`Modifica la información de la especie "${species.name}".`}
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={updateSpecies.isPending}
        submitLabel="Guardar Cambios"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <SpeciesForm />
      </FormSheet>
    </CanAccess>
  )
}
