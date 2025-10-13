'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updatePetSchema, UpdatePetSchema } from '@/schemas/pets.schema'
import { useUpdatePet } from '@/hooks/pets/use-pet-update'
import { Tables } from '@/types/supabase.types'
import { PetForm } from './pet-form'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer-form'
import { Form } from '../ui/form'
import { Button } from '../ui/button'

interface PetEditProps {
  pet: Tables<'pets'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PetEdit({ pet, open, onOpenChange }: PetEditProps) {
  const updatePet = useUpdatePet()

  const form = useForm<UpdatePetSchema>({
    resolver: zodResolver(updatePetSchema),
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
    await updatePet.mutateAsync({
      id: pet.id,
      data,
    })
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Editar Mascota</DrawerTitle>
          <DrawerDescription>
            Modifica la información de la mascota.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <PetForm mode="edit" pet={pet} />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={updatePet.isPending}
          >
            {updatePet.isPending ? 'Actualizando...' : 'Actualizar Mascota'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updatePet.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
