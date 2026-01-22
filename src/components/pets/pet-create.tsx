'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { petCreateSchema } from '@/schemas/pets.schema'
import { useCreatePet } from '@/hooks/pets/use-pet-create'
import { FormSheet } from '@/components/ui/form-sheet'
import { PetForm } from './pet-form'
import CanAccess from '@/components/ui/can-access'

interface PetCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId?: string
}

export function PetCreate({ open, onOpenChange, clientId }: PetCreateProps) {
  const createPet = useCreatePet()
  const form = useForm({
    resolver: zodResolver(petCreateSchema),
    defaultValues: {
      name: '',
      species_id: '',
      customer_id: clientId || '',
      sex: 'M',
      birth_date: '',
      weight: undefined,
      color: '',
      microchip: '',
      notes: '',
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await createPet.mutateAsync(data)
    form.reset()
    onOpenChange(false)
  })

  return (
    <CanAccess resource="pets" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Crear Mascota"
        description="Completa la información para registrar una nueva mascota."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={createPet.isPending}
        submitLabel="Crear Mascota"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-4xl"
      >
        <PetForm />
      </FormSheet>
    </CanAccess>
  )
}
