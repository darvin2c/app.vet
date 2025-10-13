'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPetSchema, CreatePetSchema } from '@/schemas/pets.schema'
import { useCreatePet } from '@/hooks/pets/use-pet-create'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer-form'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { PetForm } from './pet-form'
import { Form } from '../ui/form'
import { ProductForm } from '../products/product-form'
import { Button } from '../ui/button'
import { CreateProductSchema } from '@/schemas/products.schema'

interface PetCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId?: string
}

export function PetCreate({ open, onOpenChange, clientId }: PetCreateProps) {
  const createPet = useCreatePet()

  const form = useForm<CreatePetSchema>({
    resolver: zodResolver(createPetSchema),
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

  const onSubmit = async (data: CreatePetSchema) => {
    await createPet.mutateAsync(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Crear Mascota</DrawerTitle>
          <DrawerDescription>
            Completa la información para registrar una nueva mascota.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <PetForm />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
