'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { FormSheet } from '@/components/ui/form-sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { HospitalizationForm } from './hospitalization-form'
import { useUpdateHospitalization } from '@/hooks/hospitalizations/use-hospitalization-update'
import {
  hospitalizationUpdateSchema,
  HospitalizationUpdateSchema,
} from '@/schemas/hospitalization.schema'
import { Tables } from '@/types/supabase.types'
import { format } from 'date-fns'
import CanAccess from '@/components/ui/can-access'

// Tipo para hospitalization (sin pet_id por ahora, se agregará después)
type Hospitalization = Tables<'hospitalizations'>

interface HospitalizationEditProps {
  hospitalization: Hospitalization | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HospitalizationEdit({
  open,
  onOpenChange,
  hospitalization,
}: HospitalizationEditProps) {
  const updateHospitalization = useUpdateHospitalization()

  const form = useForm<HospitalizationUpdateSchema>({
    resolver: zodResolver(hospitalizationUpdateSchema),
    defaultValues: {
      pet_id: '',
      admission_at: '',
      discharge_at: '',
      bed_id: '',
      daily_rate: undefined,
      notes: '',
    },
  })

  // Actualizar valores del formulario cuando cambie la hospitalización
  useEffect(() => {
    if (hospitalization) {
      form.reset({
        pet_id: '', // TODO: Agregar pet_id cuando esté disponible en la tabla
        admission_at: hospitalization.admission_at
          ? format(new Date(hospitalization.admission_at), "yyyy-MM-dd'T'HH:mm")
          : '',
        discharge_at: hospitalization.discharge_at
          ? format(new Date(hospitalization.discharge_at), "yyyy-MM-dd'T'HH:mm")
          : '',
        bed_id: hospitalization.bed_id || '',
        daily_rate: hospitalization.daily_rate || undefined,
        notes: hospitalization.notes || '',
      })
    }
  }, [hospitalization, form])

  const onSubmit = async (data: HospitalizationUpdateSchema) => {
    if (!hospitalization) return

    try {
      await updateHospitalization.mutateAsync({
        id: hospitalization.id,
        data,
      })
      toast.success('Hospitalización actualizada exitosamente')
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al actualizar la hospitalización')
    }
  }

  if (!hospitalization) return null

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Hospitalización"
      description="Modifica los datos de la hospitalización"
      form={form as any}
      onSubmit={onSubmit as any}
      isPending={updateHospitalization.isPending}
      submitLabel="Actualizar Hospitalización"
      cancelLabel="Cancelar"
      side="right"
      className="!max-w-2xl"
    >
      <div className="px-4">
        <HospitalizationForm />
        <ResponsiveButton type="submit" className="sr-only">
          Actualizar Hospitalización
        </ResponsiveButton>
      </div>
    </FormSheet>
  )
}
