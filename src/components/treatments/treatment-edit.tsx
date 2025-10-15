'use client'

import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
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
import { TreatmentForm } from './treatment-form'
import { useTreatmentUpdate } from '@/hooks/treatments/use-treatment-update'
import { TreatmentSchema, TreatmentFormData } from '@/schemas/treatment.schema'
import { Tables } from '@/types/supabase.types'

interface TreatmentEditProps {
  treatment: Tables<'treatments'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TreatmentEdit({
  treatment,
  open,
  onOpenChange,
}: TreatmentEditProps) {
  const updateTreatment = useTreatmentUpdate()

  const form = useForm<TreatmentFormData>({
    resolver: zodResolver(TreatmentSchema),
    defaultValues: {
      pet_id: treatment.pet_id,
      reason: treatment.reason || '',
      treatment_type: treatment.treatment_type,
      status: treatment.status,
      treatment_date: treatment.treatment_date?.split('T')[0] || '',
      vet_id: treatment.vet_id || '',
      diagnosis: treatment.diagnosis || '',
      notes: treatment.notes || '',
    },
  })

  useEffect(() => {
    if (treatment) {
      form.reset({
        pet_id: treatment.pet_id,
        reason: treatment.reason || '',
        treatment_type: treatment.treatment_type,
        status: treatment.status,
        treatment_date: treatment.treatment_date?.split('T')[0] || '',
        vet_id: treatment.vet_id || '',
        diagnosis: treatment.diagnosis || '',
        notes: treatment.notes || '',
      })
    }
  }, [treatment, form])

  const onSubmit = async (data: TreatmentFormData) => {
    try {
      await updateTreatment.mutateAsync({
        id: treatment.id,
        data,
      })
      toast.success('Tratamiento actualizado exitosamente')
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al actualizar el tratamiento')
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar Tratamiento</DrawerTitle>
          <DrawerDescription>
            Modifica la información del tratamiento
          </DrawerDescription>
        </DrawerHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
            <TreatmentForm />
          </form>
        </FormProvider>

        <DrawerFooter>
          <ResponsiveButton
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            isLoading={updateTreatment.isPending}
          >
            Actualizar Tratamiento
          </ResponsiveButton>
          <ResponsiveButton
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </ResponsiveButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
