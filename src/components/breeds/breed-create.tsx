'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { BreedForm } from './breed-form'
import { useBreedCreate } from '@/hooks/breeds/use-breed-create'
import { breedCreateSchema, type BreedCreate } from '@/schemas/breeds.schema'

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

  const form = useForm<BreedCreate>({
    resolver: zodResolver(breedCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      species_id: selectedSpeciesId || '',
      is_active: true,
    },
  })

  const onSubmit = async (data: BreedCreate) => {
    try {
      await createBreed.mutateAsync(data)
      toast.success('Raza creada exitosamente')
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error al crear raza:', error)
      toast.error('Error al crear la raza')
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[96vh]">
        <DrawerHeader>
          <DrawerTitle>Nueva Raza</DrawerTitle>
          <DrawerDescription>
            Crea una nueva raza en el sistema
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <BreedForm selectedSpeciesId={selectedSpeciesId} />
            </form>
          </FormProvider>
        </div>

        <DrawerFooter>
          <ResponsiveButton
            type="submit"
            icon={Plus}
            isLoading={createBreed.isPending}
            disabled={createBreed.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            {createBreed.isPending ? 'Creando...' : 'Crear Raza'}
          </ResponsiveButton>
          <ResponsiveButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createBreed.isPending}
          >
            Cancelar
          </ResponsiveButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
