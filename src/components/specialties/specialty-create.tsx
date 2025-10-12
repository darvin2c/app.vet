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
  CreateSpecialtySchema,
  createSpecialtySchema,
} from '@/schemas/specialties.schema'
import useCreateSpecialty from '@/hooks/specialties/use-create-specialty'
import { Database } from '@/types/supabase.types'

type Specialty = Database['public']['Tables']['specialties']['Row']

interface SpecialtyCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSpecialtyCreated?: (specialty: Specialty) => void
}

export function SpecialtyCreate({
  open,
  onOpenChange,
  onSpecialtyCreated,
}: SpecialtyCreateProps) {
  const createSpecialty = useCreateSpecialty()

  const form = useForm({
    resolver: zodResolver(createSpecialtySchema),
    defaultValues: {
      name: '',
      is_active: true,
    },
  })

  const onSubmit = async (data: CreateSpecialtySchema) => {
    try {
      const newSpecialty = await createSpecialty.mutateAsync({
        name: data.name,
        is_active: data.is_active,
      })
      form.reset()
      onOpenChange(false)

      // Notificar que se creó la especialidad
      if (onSpecialtyCreated && newSpecialty) {
        onSpecialtyCreated(newSpecialty)
      }
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-[500px]">
        <DrawerHeader>
          <DrawerTitle>Crear Nueva Especialidad</DrawerTitle>
          <DrawerDescription>
            Complete los datos de la especialidad. Los campos marcados con * son
            obligatorios.
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
            disabled={createSpecialty.isPending}
          >
            {createSpecialty.isPending ? 'Creando...' : 'Crear Especialidad'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createSpecialty.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
