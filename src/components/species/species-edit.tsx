'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
import { SpeciesForm } from './species-form'
import {
  speciesUpdateSchema,
  type SpeciesUpdate,
} from '@/schemas/species.schema'
import { useSpeciesUpdate } from '@/hooks/species/use-species-update'
import { Tables } from '@/types/supabase.types'
import { ScrollArea } from '../ui/scroll-area'
import { Form } from '../ui/form'
import { Field } from '../ui/field'
import CanAccess from '@/components/ui/can-access'

interface SpeciesEditProps {
  species: Tables<'species'>
  onSuccess?: () => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SpeciesEdit({
  species,
  onSuccess,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: SpeciesEditProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
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

  const onSubmit = form.handleSubmit(async (data) => {
    await updateSpecies.mutateAsync({
      id: species.id,
      data,
    })
    setOpen(false)
    onSuccess?.()
    form.reset()
  })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="!max-w-2xl">
        <ScrollArea>
          <CanAccess resource="products" action="update">
            <SheetHeader>
              <SheetTitle>Editar Especie</SheetTitle>
              <SheetDescription>
                Modifica la información de la especie &quot;{species.name}
                &quot;.
              </SheetDescription>
            </SheetHeader>

            <Form {...form}>
              <form onSubmit={onSubmit} className="px-4">
                <SpeciesForm />
              </form>
            </Form>

            <SheetFooter>
              <Field orientation="horizontal">
                <ResponsiveButton
                  onClick={onSubmit}
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
              </Field>
            </SheetFooter>
          </CanAccess>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
