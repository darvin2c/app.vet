'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { FormSheet } from '@/components/ui/form-sheet'
import { BreedForm } from './breed-form'
import { useBreedCreate } from '@/hooks/breeds/use-breed-create'
import { breedCreateSchema, type BreedCreate } from '@/schemas/breeds.schema'
import CanAccess from '@/components/ui/can-access'

interface BreedCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedSpeciesId?: string
}

export function BreedCreate({
  open,
  onOpenChange,
  selectedSpeciesId,
}: BreedCreateProps) {
  const createBreed = useBreedCreate()

  const form = useForm({
    resolver: zodResolver(breedCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      species_id: selectedSpeciesId || '',
      is_active: true,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await createBreed.mutateAsync(data)
    form.reset()
    onOpenChange(false)
  })

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Nueva Raza"
        description="Crea una nueva raza en el sistema"
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={createBreed.isPending}
        submitLabel="Crear Raza"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <BreedForm selectedSpeciesId={selectedSpeciesId} />
      </FormSheet>
    </CanAccess>
  )
}
