'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ClinicalParameterForm } from './clinical-parameter-form'
import {
  ClinicalParameterSchema,
  type ClinicalParameterFormData,
} from '@/schemas/clinical-parameters.schema'
import { useClinicalParameterUpdate } from '@/hooks/clinical-parameters/use-clinical-parameter-update'
import { Json, Tables } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

interface ClinicalParameterEditProps {
  clinicalParameter: Tables<'clinical_parameters'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClinicalParameterEdit({
  clinicalParameter,
  open,
  onOpenChange,
}: ClinicalParameterEditProps) {
  const updateClinicalParameter = useClinicalParameterUpdate()

  const form = useForm<ClinicalParameterFormData>({
    resolver: zodResolver(ClinicalParameterSchema),
    defaultValues: {
      measured_at: clinicalParameter?.measured_at || '',
      params:
        (clinicalParameter?.params as Record<string, string | number>) || {},
      schema_version: clinicalParameter?.schema_version,
    },
  })

  const onSubmit = (data: ClinicalParameterFormData) => {
    updateClinicalParameter.mutate({
      id: clinicalParameter.id,
      data: {
        ...data,
        params: data.params as Json,
      },
    })
  }

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Parámetros Clínicos"
      description="Modifica los parámetros clínicos del registro médico"
      form={form as any}
      onSubmit={onSubmit as any}
      isPending={updateClinicalParameter.isPending}
      submitLabel="Actualizar Parámetros"
      cancelLabel="Cancelar"
      side="right"
      className="!max-w-2xl"
    >
      <div className="px-4">
        <ClinicalParameterForm petId={clinicalParameter.pet_id} />
        <ResponsiveButton type="submit" className="sr-only">
          Actualizar Parámetros
        </ResponsiveButton>
      </div>
    </FormSheet>
  )
}
