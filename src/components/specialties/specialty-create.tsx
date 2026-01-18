'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { SpecialtyForm } from './specialty-form'
import {
  SpecialtyCreateSchema,
  specialtyCreateSchema,
} from '@/schemas/specialties.schema'
import useSpecialtyCreate from '@/hooks/specialties/use-specialty-create'
import CanAccess from '@/components/ui/can-access'

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
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Crear Especialidad"
        description="Agrega una nueva especialidad para tu centro veterinario."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={isPending}
        submitLabel="Crear Especialidad"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <SpecialtyForm />
      </FormSheet>
    </CanAccess>
  )
}
