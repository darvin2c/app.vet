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
} from '@/components/ui/drawer-form'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ClinicalParameterForm } from './clinical-parameter-form'
import {
  ClinicalParameterSchema,
  type ClinicalParameterFormData,
} from '@/schemas/clinical-parameters.schema'
import { useClinicalParameterCreate } from '@/hooks/clinical-parameters/use-clinical-parameter-create'

interface ClinicalParameterCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  petId: string
}

export function ClinicalParameterCreate({
  open,
  onOpenChange,
  petId,
}: ClinicalParameterCreateProps) {
  const createClinicalParameter = useClinicalParameterCreate()

  const form = useForm({
    resolver: zodResolver(ClinicalParameterSchema),
    defaultValues: {
      treatment_id: undefined, // This will be set when creating a treatment
      measured_at: new Date().toISOString().split('T')[0],
      params: {} as Record<string, string | number>,
      schema_version: 1,
    },
  })

  const onSubmit = async (data: ClinicalParameterFormData) => {
    try {
      await createClinicalParameter.mutateAsync(data)
      toast.success('Parámetros clínicos creados exitosamente')
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error('Error al crear los parámetros clínicos')
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Nuevos Parámetros Clínicos</DrawerTitle>
          <DrawerDescription>
            Registra los parámetros clínicos del registro médico
          </DrawerDescription>
        </DrawerHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
            <ClinicalParameterForm petId={petId} />
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
              isLoading={createClinicalParameter.isPending}
              className="flex-1"
            >
              Crear Parámetros
            </ResponsiveButton>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
