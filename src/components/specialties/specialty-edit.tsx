'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { SpecialtyForm } from './specialty-form'
import useSpecialtyUpdate from '@/hooks/specialties/use-specialty-update'
import { Tables } from '@/types/supabase.types'
import {
  SpecialtyUpdateSchema,
  specialtyUpdateSchema,
} from '@/schemas/specialties.schema'

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

  const form = useForm<SpecialtyUpdateSchema>({
    resolver: zodResolver(specialtyUpdateSchema),
    defaultValues: {
      name: specialty.name,
      description: specialty.description ?? '',
      is_active: specialty.is_active,
    },
  })

  const onSubmit = async (values: SpecialtyUpdateSchema) => {
    await updateSpecialty.mutateAsync({ id: specialty.id, data: values })
    onOpenChange(false)
  }

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Especialidad"
      description="Actualiza la información de la especialidad seleccionada."
      form={form as any}
      onSubmit={onSubmit as any}
      isPending={updateSpecialty.isPending}
      submitLabel="Guardar Cambios"
      cancelLabel="Cancelar"
      side="right"
      className="!max-w-2xl"
    >
      <SpecialtyForm />
    </FormSheet>
  )
}
