'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPetSchema, CreatePetSchema } from '@/schemas/pets.schema'
import { usePetCreate } from '@/hooks/pets/use-pet-create'
import { DrawerForm } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { PetForm } from './pet-form'

interface PetCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId?: string
}

export function PetCreate({ open, onOpenChange, clientId }: PetCreateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutateAsync: createPet } = usePetCreate()

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
    try {
      setIsSubmitting(true)
      await createPet(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error al crear mascota:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DrawerForm
      open={open}
      onOpenChange={onOpenChange}
      title="Crear Mascota"
      description="Registra una nueva mascota en el sistema"
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PetForm />
          
          <DrawerFooter>
            <ResponsiveButton
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Crear Mascota
            </ResponsiveButton>
            <ResponsiveButton
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </ResponsiveButton>
          </DrawerFooter>
        </form>
      </FormProvider>
    </DrawerForm>
  )
}