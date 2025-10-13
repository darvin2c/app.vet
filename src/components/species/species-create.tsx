'use client'

import { useState } from 'react'
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
import { SpeciesForm } from './species-form'
import { speciesCreateSchema } from '@/schemas/species.schema'
import { useSpeciesCreate } from '@/hooks/species/use-species-create'

interface SpeciesCreateProps {
  onSuccess?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SpeciesCreate({
  onSuccess,
  open,
  onOpenChange,
}: SpeciesCreateProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = open !== undefined ? open : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const createSpecies = useSpeciesCreate()

  const form = useForm({
    resolver: zodResolver(speciesCreateSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit = async (data: any) => {
    await createSpecies.mutateAsync(data)
    toast.success('Especie creada exitosamente')
    form.reset()
    setOpen(false)
    onSuccess?.()
  }

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerContent className="!max-w-xl">
        <DrawerHeader>
          <DrawerTitle>Crear Nueva Especie</DrawerTitle>
          <DrawerDescription>
            Agrega una nueva especie al sistema. Las especies pueden tener
            múltiples razas asociadas.
          </DrawerDescription>
        </DrawerHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
            <SpeciesForm />
          </form>
        </FormProvider>

        <DrawerFooter>
          <ResponsiveButton
            onClick={form.handleSubmit(onSubmit)}
            isLoading={createSpecies.isPending}
            type="submit"
            variant="default"
          >
            Crear Especie
          </ResponsiveButton>
          <ResponsiveButton onClick={() => setOpen(false)} variant="outline">
            Cancelar
          </ResponsiveButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
