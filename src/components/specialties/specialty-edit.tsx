'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { SpecialtyForm } from './specialty-form'
import {
  UpdateSpecialtySchema,
  updateSpecialtySchema,
} from '@/schemas/specialties.schema'
import useSpecialtyUpdate from '@/hooks/specialties/use-specialty-update'
import { Form } from '@/components/ui/form'
import { Tables } from '@/types/supabase.types'

interface SpecialtyEditProps {
  specialty: Tables<'specialties'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SpecialtyEdit({
  specialty,
  open,
  onOpenChange,
}: SpecialtyEditProps) {
  const updateSpecialty = useSpecialtyUpdate()

  const form = useForm<UpdateSpecialtySchema>({
    resolver: zodResolver(updateSpecialtySchema),
    defaultValues: {
      name: specialty.name,
      description: specialty.description ?? '',
      is_active: specialty.is_active,
    },
  })

  const onSubmit = async (values: UpdateSpecialtySchema) => {
    await updateSpecialty.mutateAsync({ id: specialty.id, data: values })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar Especialidad</SheetTitle>
          <SheetDescription>
            Actualiza la información de la especialidad seleccionada.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <SpecialtyForm />

            <SheetFooter>
              <ResponsiveButton
                type="submit"
                isLoading={updateSpecialty.isPending}
              >
                Guardar Cambios
              </ResponsiveButton>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
