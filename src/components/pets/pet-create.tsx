'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { petCreateSchema } from '@/schemas/pets.schema'
import { useCreatePet } from '@/hooks/pets/use-pet-create'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { PetForm } from './pet-form'
import { Form } from '../ui/form'
import { Button } from '../ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { ScrollArea } from '../ui/scroll-area'
import { Field } from '../ui/field'

interface PetCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId?: string
}

export function PetCreate({ open, onOpenChange, clientId }: PetCreateProps) {
  const createPet = useCreatePet()
  const isMobile = useIsMobile()
  const form = useForm({
    resolver: zodResolver(petCreateSchema),
    defaultValues: {
      name: '',
      species_id: '',
      client_id: clientId || '',
      sex: 'M',
      birth_date: '',
      weight: undefined,
      color: '',
      microchip: '',
      notes: '',
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await createPet.mutateAsync(data)
    form.reset()
    onOpenChange(false)
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? 'bottom' : 'right'} className="!max-w-4xl">
        <ScrollArea className="h-full">
          <SheetHeader>
            <SheetTitle>Crear Mascota</SheetTitle>
            <SheetDescription>
              Completa la información para registrar una nueva mascota.
            </SheetDescription>
          </SheetHeader>

          <div className="px-4">
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <PetForm />
              </form>
            </Form>
          </div>

          <SheetFooter>
            <Field orientation="horizontal">
              <Button
                type="submit"
                onClick={onSubmit}
                disabled={createPet.isPending}
              >
                {createPet.isPending ? 'Creando...' : 'Crear Mascota'}
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createPet.isPending}
              >
                Cancelar
              </Button>
            </Field>
          </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
