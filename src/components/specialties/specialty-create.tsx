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
  CreateSpecialtySchema,
  createSpecialtySchema,
} from '@/schemas/specialties.schema'
import useSpecialtyCreate from '@/hooks/specialties/use-specialty-create'
import { Form } from '../ui/form'

interface SpecialtyCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SpecialtyCreate({ open, onOpenChange }: SpecialtyCreateProps) {
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

  const onSubmit = (data: CreateSpecialtySchema) => {
    createSpecialty(data, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full !max-w-2xl">
        <SheetHeader>
          <SheetTitle>Nueva Especialidad</SheetTitle>
          <SheetDescription>
            Crea una nueva especialidad para el personal médico
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
            disabled={isPending}
          >
            Cancelar
          </ResponsiveButton>
          <ResponsiveButton
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            isLoading={isPending}
            disabled={isPending}
          >
            Crear Especialidad
          </ResponsiveButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
