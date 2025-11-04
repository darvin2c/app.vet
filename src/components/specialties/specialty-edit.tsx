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
      code: specialty.code ?? '',
      description: specialty.description ?? '',
      is_active: specialty.is_active,
    },
  })

  const onSubmit = async (data: UpdateSpecialtySchema) => {
    await updateSpecialty.mutateAsync({
      id: specialty.id,
      data,
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full !max-w-2xl">
        <SheetHeader>
          <SheetTitle>Editar Especialidad</SheetTitle>
          <SheetDescription>
            Modifica la información de la especialidad.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-6">
            <div className="flex-1 overflow-y-auto">
              <SpecialtyForm />
            </div>
          </form>
        </Form>

        <SheetFooter className="flex-row">
          <ResponsiveButton
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateSpecialty.isPending}
          >
            Cancelar
          </ResponsiveButton>
          <ResponsiveButton
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            isLoading={updateSpecialty.isPending}
            disabled={updateSpecialty.isPending}
          >
            Actualizar Especialidad
          </ResponsiveButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
