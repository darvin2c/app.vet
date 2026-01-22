'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { petUpdateSchema, UpdatePetSchema } from '@/schemas/pets.schema'
import { useUpdatePet } from '@/hooks/pets/use-pet-update'
import { Tables } from '@/types/supabase.types'
import { PetForm } from './pet-form'
import { FormSheet } from '@/components/ui/form-sheet'
import CanAccess from '@/components/ui/can-access'

interface PetEditProps {
  pet: Tables<'pets'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PetEdit({ pet, open, onOpenChange }: PetEditProps) {
  const updatePet = useUpdatePet()
  const form = useForm({
    resolver: zodResolver(petUpdateSchema),
    defaultValues: {
      name: pet.name,
      species_id: pet.species_id,
      breed_id: pet.breed_id || '',
      sex: pet.sex,
      birth_date: pet.birth_date || '',
      weight: pet.weight || undefined,
      color: pet.color || '',
      microchip: pet.microchip || '',
      notes: pet.notes || '',
    },
  })

  // Actualizar valores del formulario cuando cambie la mascota
  useEffect(() => {
    if (pet) {
      form.reset({
        name: pet.name,
        species_id: pet.species_id,
        breed_id: pet.breed_id || '',
        customer_id: pet.customer_id,
        sex: pet.sex,
        birth_date: pet.birth_date || '',
        weight: pet.weight || undefined,
        color: pet.color || '',
        microchip: pet.microchip || '',
        notes: pet.notes || '',
      })
    }
  }, [pet, form])

  const onSubmit = form.handleSubmit(async (data: UpdatePetSchema) => {
    await updatePet.mutateAsync({
      id: pet.id,
      data,
    })
    onOpenChange(false)
    form.reset()
  })

  return (
    <CanAccess resource="pets" action="update">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Editar Mascota"
        description="Modifica la información de la mascota."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={updatePet.isPending}
        submitLabel="Actualizar Mascota"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-4xl"
      >
        <PetForm mode="edit" />
      </FormSheet>
    </CanAccess>
  )
}
