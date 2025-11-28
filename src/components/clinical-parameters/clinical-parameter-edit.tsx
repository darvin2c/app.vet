'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer-form'
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!max-w-2xl">
        <CanAccess resource="products" action="update">
          <DrawerHeader>
            <DrawerTitle>Editar Parámetros Clínicos</DrawerTitle>
            <DrawerDescription>
              Modifica los parámetros clínicos del registro médico
            </DrawerDescription>
          </DrawerHeader>

          <FormProvider {...form}>
            <div className="px-4">
              <ClinicalParameterForm petId={clinicalParameter.pet_id} />
            </div>
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
        </CanAccess>
      </DrawerContent>
    </Drawer>
  )
}
