'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ClinicalParameterForm } from './clinical-parameter-form'
import {
  ClinicalParameterSchema,
  type ClinicalParameterFormData,
} from '@/schemas/clinical-parameters.schema'
import { useClinicalParameterUpdate } from '@/hooks/clinical-parameters/use-clinical-parameter-update'
import { Tables } from '@/types/supabase.types'

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

  const form = useForm({
    resolver: zodResolver(ClinicalParameterSchema),
    defaultValues: {
      medical_record_id: clinicalParameter.medical_record_id,
      measured_at: clinicalParameter.measured_at
        ? clinicalParameter.measured_at.split('T')[0]
        : new Date().toISOString().split('T')[0],
      params:
        (clinicalParameter.params as Record<string, string | number>) || {},
      schema_version: clinicalParameter.schema_version || 1,
    },
  })

  const onSubmit = async (data: ClinicalParameterFormData) => {
    try {
      await updateClinicalParameter.mutateAsync({
        id: clinicalParameter.id,
        data,
      })
      toast.success('Parámetros clínicos actualizados exitosamente')
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al actualizar los parámetros clínicos')
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar Parámetros Clínicos</DrawerTitle>
          <DrawerDescription>
            Modifica los parámetros clínicos del tratamiento
          </DrawerDescription>
        </DrawerHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
            <ClinicalParameterForm />
          </form>
        </FormProvider>

        <DrawerFooter>
          <div className="flex gap-2">
            <ResponsiveButton
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </ResponsiveButton>
            <ResponsiveButton
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              isLoading={updateClinicalParameter.isPending}
              className="flex-1"
            >
              Actualizar Parámetros
            </ResponsiveButton>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
