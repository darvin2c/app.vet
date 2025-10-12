'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPetSchema, CreatePetSchema } from '@/schemas/pets.schema'
import { useCreatePet } from '@/hooks/pets/use-pet-create'
import { DrawerForm } from '@/components/ui/drawer-form'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { PetForm } from './pet-form'

interface PetCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId?: string
}

export function PetCreate({ open, onOpenChange, clientId }: PetCreateProps) {
  const { mutate: createPet, isPending: isSubmitting } = useCreatePet()

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
      createPet(data, {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
        onError: (error) => {
          console.error('Error al crear mascota:', error)
        },
      })
    } catch (error) {
      console.error('Error al crear mascota:', error)
    }
  }

  const footer = (
    <>
      <ResponsiveButton
        type="submit"
        isLoading={isSubmitting}
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
    </>
  )

  return (
    <DrawerForm
      title="Crear Mascota"
      description="Completa la información para registrar una nueva mascota."
      open={open}
      onOpenChange={onOpenChange}
      footer={footer}
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PetForm mode="create" />
        </form>
      </FormProvider>
    </DrawerForm>
  )
}
