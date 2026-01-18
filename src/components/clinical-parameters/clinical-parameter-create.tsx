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
import { useClinicalParameterCreate } from '@/hooks/clinical-parameters/use-clinical-parameter-create'
import { Json } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

interface ClinicalParameterCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  petId: string
  clinicalRecordId: string
}

export function ClinicalParameterCreate({
  open,
  onOpenChange,
  petId,
  clinicalRecordId,
}: ClinicalParameterCreateProps) {
  const createClinicalParameter = useClinicalParameterCreate()

  const form = useForm<ClinicalParameterFormData>({
    resolver: zodResolver(ClinicalParameterSchema),
    defaultValues: {
      measured_at: new Date().toISOString().split('T')[0],
      params: {} as Record<string, string | number>,
      schema_version: undefined,
    },
  })

  const onSubmit = async (data: ClinicalParameterFormData) => {
    const dataWithPetId = {
      ...data,
      pet_id: petId,
      clinical_record_id: clinicalRecordId,
      params: data.params as Json,
    }
    await createClinicalParameter.mutateAsync(dataWithPetId)
    onOpenChange(false)
    form.reset()
  }

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Nuevos Parámetros Clínicos"
        description="Registra los parámetros clínicos del registro médico"
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={createClinicalParameter.isPending}
        submitLabel="Crear Parámetros"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <div className="px-4">
          <ClinicalParameterForm petId={petId} />
          <ResponsiveButton type="submit" className="sr-only">
            Crear Parámetros
          </ResponsiveButton>
        </div>
      </FormSheet>
    </CanAccess>
  )
}
