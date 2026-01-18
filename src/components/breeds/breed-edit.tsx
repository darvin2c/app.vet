'use client'

import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { BreedForm } from './breed-form'
import { useBreedUpdate } from '@/hooks/breeds/use-breed-update'
import { breedUpdateSchema, type BreedUpdate } from '@/schemas/breeds.schema'
import { Tables } from '@/types/supabase.types'

interface BreedEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  breed: Tables<'breeds'>
}

export function BreedEdit({ open, onOpenChange, breed }: BreedEditProps) {
  const updateBreed = useBreedUpdate()

  const form = useForm<BreedUpdate>({
    resolver: zodResolver(breedUpdateSchema),
    defaultValues: {
      name: breed.name,
      description: breed.description || '',
      species_id: breed.species_id,
      is_active: breed.is_active,
    },
  })

  // Actualizar valores del formulario cuando cambie la raza
  useEffect(() => {
    if (breed) {
      form.reset({
        name: breed.name,
        description: breed.description || '',
        species_id: breed.species_id,
        is_active: breed.is_active,
      })
    }
  }, [breed, form])

  const onSubmit = form.handleSubmit(async (data: BreedUpdate) => {
    await updateBreed.mutateAsync({ id: breed.id, data })
    onOpenChange(false)
    form.reset()
  })

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Raza"
      description={`Modifica los datos de la raza ${breed.name}`}
      form={form as any}
      onSubmit={onSubmit as any}
      isPending={updateBreed.isPending}
      submitLabel="Actualizar Raza"
      cancelLabel="Cancelar"
      side="right"
      className="!max-w-2xl"
    >
      <BreedForm />
    </FormSheet>
  )
}
