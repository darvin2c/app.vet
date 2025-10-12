'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updatePetSchema, UpdatePetSchema } from '@/schemas/pets.schema'
import { usePetUpdate } from '@/hooks/pets/use-pet-update'
import { Tables } from '@/types/supabase.types'
import { DrawerForm } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { PetForm } from './pet-form'

interface PetEditProps {
  pet: Tables<'pets'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PetEdit({ pet, open, onOpenChange }: PetEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutateAsync: updatePet } = usePetUpdate()

  const form = useForm<UpdatePetSchema>({
    resolver: zodResolver(updatePetSchema),
    defaultValues: {
      name: pet.name,
      species: pet.species,
      gender: pet.gender || undefined,
      date_of_birth: pet.date_of_birth || '',
      weight: pet.weight || undefined,
      color: pet.color || '',
      microchip_number: pet.microchip_number || '',
      is_sterilized: pet.is_sterilized || false,
      allergies: pet.allergies || '',
      medical_notes: pet.medical_notes || '',
      is_active: pet.is_active,
    },
  })

  // Actualizar valores del formulario cuando cambie la mascota
  useEffect(() => {
    if (pet) {
      form.reset({
        name: pet.name,
        species: pet.species,
        gender: pet.gender || undefined,
        date_of_birth: pet.date_of_birth || '',
        weight: pet.weight || undefined,
        color: pet.color || '',
        microchip_number: pet.microchip_number || '',
        is_sterilized: pet.is_sterilized || false,
        allergies: pet.allergies || '',
        medical_notes: pet.medical_notes || '',
        is_active: pet.is_active,
      })
    }
  }, [pet, form])

  const onSubmit = async (data: UpdatePetSchema) => {
    try {
      setIsSubmitting(true)
      await updatePet({ id: pet.id, data })
      onOpenChange(false)
    } catch (error) {
      console.error('Error al actualizar mascota:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DrawerForm
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Mascota"
      description={`Editar información de ${pet.name}`}
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PetForm />
          
          <DrawerFooter>
            <ResponsiveButton
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Guardar Cambios
            </ResponsiveButton>
            <ResponsiveButton
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </ResponsiveButton>
          </DrawerFooter>
        </form>
      </FormProvider>
    </DrawerForm>
  )
}