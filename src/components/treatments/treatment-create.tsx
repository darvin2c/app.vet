'use client'

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
} from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { TreatmentForm } from './treatment-form'
import { useTreatmentCreate } from '@/hooks/treatments/use-treatment-create'
import { TreatmentSchema, TreatmentFormData } from '@/schemas/treatment.schema'

interface TreatmentCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  petId?: string
}

export function TreatmentCreate({
  open,
  onOpenChange,
  petId,
}: TreatmentCreateProps) {
  const createTreatment = useTreatmentCreate()

  const form = useForm<TreatmentFormData>({
    resolver: zodResolver(TreatmentSchema),
    defaultValues: {
      pet_id: petId || '',
      reason: '',
      treatment_type: 'consultation',
      status: 'draft',
      treatment_date: new Date().toISOString().split('T')[0],
      vet_id: '',
      diagnosis: '',
      notes: '',
    },
  })

  const onSubmit = async (data: TreatmentFormData) => {
    try {
      await createTreatment.mutateAsync({
        ...data,
        pet_id: petId || data.pet_id,
      })
      toast.success('Tratamiento registrado exitosamente')
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al registrar el tratamiento')
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Nuevo Tratamiento</DrawerTitle>
          <DrawerDescription>
            Registra un nuevo tratamiento para la mascota
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TreatmentForm />
            </form>
          </FormProvider>
        </div>

        <DrawerFooter>
          <ResponsiveButton
            type="submit"
            isLoading={createTreatment.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            Registrar Tratamiento
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
