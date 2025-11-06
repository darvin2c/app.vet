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
  SpecialtyCreateSchema,
  specialtyCreateSchema,
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
    resolver: zodResolver(specialtyCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
    },
  })

  const onSubmit = async (values: SpecialtyCreateSchema) => {
    await createSpecialty(values)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Crear Especialidad</SheetTitle>
          <SheetDescription>
            Agrega una nueva especialidad para tu centro veterinario.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <SpecialtyForm />

            <SheetFooter>
              <ResponsiveButton type="submit" isLoading={isPending}>
                Crear Especialidad
              </ResponsiveButton>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
