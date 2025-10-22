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
import { Json } from '@/types/supabase.types'

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

  const form = useForm<ClinicalParameterFormData>({
    resolver: zodResolver(ClinicalParameterSchema),
    defaultValues: {
      record_id: '',
      measured_at: new Date().toISOString().split('T')[0],
      params: {} as Record<string, string | number>,
      schema_version: undefined,
    },
  })

  const onSubmit = async (data: ClinicalParameterFormData) => {
    const dataWithPetId = {
      ...data,
      pet_id: petId,
      params: data.params as Json,
    }
    await createClinicalParameter.mutateAsync(dataWithPetId)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!max-w-2xl">
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
