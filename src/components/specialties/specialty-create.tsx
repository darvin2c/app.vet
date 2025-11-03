'use client'

import { useForm, FormProvider } from 'react-hook-form'
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
  CreateSpecialtySchema,
  createSpecialtySchema,
} from '@/schemas/specialties.schema'
import useSpecialtyCreate from '@/hooks/specialties/use-specialty-create'

interface SpecialtyCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SpecialtyCreate({
  open,
  onOpenChange,
}: SpecialtyCreateProps) {
  const { mutate: createSpecialty, isPending } = useSpecialtyCreate()

  const form = useForm({
    resolver: zodResolver(createSpecialtySchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      is_active: true,
    },
  })

  const onSubmit = (data: any) => {
    createSpecialty(data, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nueva Especialidad</SheetTitle>
          <SheetDescription>
            Crea una nueva especialidad para el personal médico
          </SheetDescription>
        </SheetHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex-1 overflow-y-auto">
              <SpecialtyForm />
            </div>

            <SheetFooter>
              <ResponsiveButton
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </ResponsiveButton>
              <ResponsiveButton
                type="submit"
                isLoading={isPending}
                disabled={isPending}
              >
                Crear Especialidad
              </ResponsiveButton>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}