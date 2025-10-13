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
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { SpeciesForm } from './species-form'
import {
  speciesUpdateSchema,
  type SpeciesUpdate,
} from '@/schemas/species.schema'
import { useSpeciesUpdate } from '@/hooks/species/use-species-update'
import { Tables } from '@/types/supabase.types'
import { Edit } from 'lucide-react'

interface SpeciesEditProps {
  species: Tables<'species'>
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function SpeciesEdit({ species, onSuccess, trigger }: SpeciesEditProps) {
  const [open, setOpen] = useState(false)
  const updateSpecies = useSpeciesUpdate()

  const form = useForm<SpeciesUpdate>({
    resolver: zodResolver(speciesUpdateSchema),
    defaultValues: {
      name: species.name,
      description: species.description || '',
      is_active: species.is_active,
    },
  })

  // Actualizar valores del formulario cuando cambie la especie
  useEffect(() => {
    form.reset({
      name: species.name,
      description: species.description || '',
      is_active: species.is_active,
    })
  }, [species, form])

  const onSubmit = async (data: SpeciesUpdate) => {
    try {
      await updateSpecies.mutateAsync({
        id: species.id,
        data,
      })
      toast.success('Especie actualizada exitosamente')
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al actualizar la especie'
      )
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {trigger || (
          <ResponsiveButton
            variant="ghost"
            size="sm"
            icon={Edit}
            tooltip="Editar especie"
          >
            Editar
          </ResponsiveButton>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar Especie</DrawerTitle>
          <DrawerDescription>
            Modifica la información de la especie &quot;{species.name}&quot;.
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
            isLoading={updateSpecies.isPending}
            disabled={updateSpecies.isPending}
            type="submit"
            variant="default"
          >
            Guardar Cambios
          </ResponsiveButton>
          <ResponsiveButton
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={updateSpecies.isPending}
          >
            Cancelar
          </ResponsiveButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
