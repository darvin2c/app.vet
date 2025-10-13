'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer-form'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { BreedForm } from './breed-form'
import { useBreedUpdate } from '@/hooks/breeds/use-breed-update'
import { breedUpdateSchema, type BreedUpdate } from '@/schemas/breeds.schema'
import { Tables } from '@/types/supabase.types'
import { Pencil } from 'lucide-react'

interface BreedEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  breed: Tables<'breeds'>
}

export function BreedEdit({ open, onOpenChange, breed }: BreedEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const onSubmit = async (data: BreedUpdate) => {
    try {
      setIsSubmitting(true)
      await updateBreed.mutateAsync({ id: breed.id, data })
      toast.success('Raza actualizada exitosamente')
      onOpenChange(false)
    } catch (error) {
      console.error('Error al actualizar raza:', error)
      toast.error('Error al actualizar la raza')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[96vh]">
        <DrawerHeader>
          <DrawerTitle>Editar Raza</DrawerTitle>
          <DrawerDescription>
            Modifica los datos de la raza {breed.name}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <BreedForm />
            </form>
          </FormProvider>
        </div>

        <DrawerFooter>
          <ResponsiveButton
            type="submit"
            icon={Pencil}
            isLoading={updateBreed.isPending}
            disabled={updateBreed.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            {updateBreed.isPending ? 'Actualizando...' : 'Actualizar Raza'}
          </ResponsiveButton>
          <ResponsiveButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </ResponsiveButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
