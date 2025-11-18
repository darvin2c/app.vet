'use client'

import { useState } from 'react'
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
import { speciesCreateSchema } from '@/schemas/species.schema'
import { useSpeciesCreate } from '@/hooks/species/use-species-create'
import { ScrollArea } from '../ui/scroll-area'
import { Form } from '../ui/form'
import { Field } from '../ui/field'
import CanAccess from '@/components/ui/can-access'

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

  const onSubmit = form.handleSubmit(async (data) => {
    await createSpecies.mutateAsync(data)
    form.reset()
    setOpen(false)
    onSuccess?.()
  })

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="!max-w-2xl">
        <ScrollArea>
          <CanAccess resource="products" action="create">
            <SheetHeader>
              <SheetTitle>Crear Nueva Especie</SheetTitle>
              <SheetDescription>
                Agrega una nueva especie al sistema. Las especies pueden tener
                múltiples razas asociadas.
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
                  isLoading={createSpecies.isPending}
                  type="submit"
                  variant="default"
                >
                  Crear Especie
                </ResponsiveButton>
                <ResponsiveButton
                  onClick={() => setOpen(false)}
                  variant="outline"
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
