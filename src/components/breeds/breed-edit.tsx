'use client'

import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { BreedForm } from './breed-form'
import { useBreedUpdate } from '@/hooks/breeds/use-breed-update'
import { breedUpdateSchema, type BreedUpdate } from '@/schemas/breeds.schema'
import { Tables } from '@/types/supabase.types'
import { ScrollArea } from '../ui/scroll-area'

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-2xl">
        <ScrollArea>
          <SheetHeader>
            <SheetTitle>Editar Raza</SheetTitle>
            <SheetDescription>
              Modifica los datos de la raza {breed.name}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4">
            <FormProvider {...form}>
              <form onSubmit={onSubmit} className="space-y-6">
                <BreedForm />
              </form>
            </FormProvider>
          </div>

          <SheetFooter className="flex-row">
            <ResponsiveButton
              type="submit"
              isLoading={updateBreed.isPending}
              disabled={updateBreed.isPending}
              onClick={onSubmit}
            >
              {updateBreed.isPending ? 'Actualizando...' : 'Actualizar Raza'}
            </ResponsiveButton>
            <ResponsiveButton
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateBreed.isPending}
            >
              Cancelar
            </ResponsiveButton>
          </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
