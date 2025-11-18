'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { petUpdateSchema, UpdatePetSchema } from '@/schemas/pets.schema'
import { useUpdatePet } from '@/hooks/pets/use-pet-update'
import { Tables } from '@/types/supabase.types'
import { PetForm } from './pet-form'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Form } from '../ui/form'
import { Button } from '../ui/button'
import { Field } from '../ui/field'
import { ScrollArea } from '../ui/scroll-area'
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full !max-w-4xl">
        <ScrollArea className="max-h-screen">
          <CanAccess resource="products" action="update">
            <SheetHeader>
              <SheetTitle>Editar Mascota</SheetTitle>
              <SheetDescription>
                Modifica la información de la mascota.
              </SheetDescription>
            </SheetHeader>

            <div className="px-4 overflow-y-auto">
              <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-4">
                  <PetForm mode="edit" pet={pet} />
                </form>
              </Form>
            </div>

            <SheetFooter>
              <Field orientation="horizontal">
                <Button
                  type="submit"
                  onClick={onSubmit}
                  disabled={updatePet.isPending}
                >
                  {updatePet.isPending
                    ? 'Actualizando...'
                    : 'Actualizar Mascota'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={updatePet.isPending}
                >
                  Cancelar
                </Button>
              </Field>
            </SheetFooter>
          </CanAccess>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
