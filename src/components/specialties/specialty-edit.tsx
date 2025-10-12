'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { SpecialtyForm } from './specialty-form'
import {
  UpdateSpecialtySchema,
  updateSpecialtySchema,
} from '@/schemas/specialties.schema'
import useUpdateSpecialty from '@/hooks/specialties/use-update-specialty'
import { Database } from '@/types/supabase.types'
import { useEffect } from 'react'

type Specialty = Database['public']['Tables']['specialties']['Row']

interface SpecialtyEditProps {
  specialty: Specialty
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SpecialtyEdit({
  specialty,
  open,
  onOpenChange,
}: SpecialtyEditProps) {
  const updateSpecialty = useUpdateSpecialty()

  const form = useForm({
    resolver: zodResolver(updateSpecialtySchema),
    defaultValues: {
      name: '',
      is_active: true,
    },
  })

  // Cargar datos de la especialidad cuando se abre el drawer
  useEffect(() => {
    if (open && specialty) {
      form.reset({
        name: specialty.name || '',
        is_active: specialty.is_active ?? true,
      })
    }
  }, [open, specialty, form])

  const onSubmit = async (data: UpdateSpecialtySchema) => {
    try {
      await updateSpecialty.mutateAsync({
        id: specialty.id,
        name: data.name,
        is_active: data.is_active,
      })
      onOpenChange(false)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-[500px]">
        <DrawerHeader>
          <DrawerTitle>Editar Especialidad</DrawerTitle>
          <DrawerDescription>
            Modifique los datos de la especialidad. Los campos marcados con *
            son obligatorios.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <SpecialtyForm />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={updateSpecialty.isPending}
          >
            {updateSpecialty.isPending
              ? 'Actualizando...'
              : 'Actualizar Especialidad'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateSpecialty.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
