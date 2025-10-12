'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updatePetSchema, UpdatePetSchema } from '@/schemas/pets.schema'
import { useUpdatePet } from '@/hooks/pets/use-pet-update'
import { Tables } from '@/types/supabase.types'
import { DrawerForm } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { PetForm } from './pet-form'
import { Save, X } from 'lucide-react'

interface PetEditProps {
  pet: Tables<'pets'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PetEdit({ pet, open, onOpenChange }: PetEditProps) {
  const { mutate: updatePet, isPending: isSubmitting } = useUpdatePet()

  const form = useForm<UpdatePetSchema>({
    resolver: zodResolver(updatePetSchema),
    defaultValues: {
      name: pet.name,
      species_id: pet.species_id,
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
        sex: pet.sex,
        birth_date: pet.birth_date || '',
        weight: pet.weight || undefined,
        color: pet.color || '',
        microchip: pet.microchip || '',
        notes: pet.notes || '',
      })
    }
  }, [pet, form])

  const onSubmit = async (data: UpdatePetSchema) => {
    try {
      updatePet({ id: pet.id, data }, {
        onSuccess: () => {
          onOpenChange(false)
        },
        onError: (error) => {
          console.error('Error al actualizar mascota:', error)
        }
      })
    } catch (error) {
      console.error('Error al actualizar mascota:', error)
    }
  }

  return (
    <DrawerForm
        trigger={<></>}
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
              isLoading={isSubmitting}
              disabled={isSubmitting}
              icon={Save}
            >
              Guardar Cambios
            </ResponsiveButton>
            <ResponsiveButton
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              icon={X}
            >
              Cancelar
            </ResponsiveButton>
          </DrawerFooter>
        </form>
      </FormProvider>
    </DrawerForm>
  )
}