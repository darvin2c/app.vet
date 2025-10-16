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
} from '@/components/ui/drawer-form'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { HospitalizationForm } from './hospitalization-form'
import { useCreateHospitalization } from '@/hooks/hospitalizations/use-hospitalization-create'
import { 
  hospitalizationCreateSchema, 
  HospitalizationCreateSchema 
} from '@/schemas/hospitalization.schema'

interface HospitalizationCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  petId: string
}

export function HospitalizationCreate({
  open,
  onOpenChange,
  petId,
}: HospitalizationCreateProps) {
  const createHospitalization = useCreateHospitalization()

  const form = useForm<HospitalizationCreateSchema>({
    resolver: zodResolver(hospitalizationCreateSchema),
    defaultValues: {
      pet_id: petId,
      admission_at: new Date().toISOString().slice(0, 16), // formato datetime-local
      discharge_at: '',
      bed_id: '',
      daily_rate: undefined,
      notes: '',
    },
  })

  const onSubmit = async (data: HospitalizationCreateSchema) => {
    try {
      await createHospitalization.mutateAsync(data)
      toast.success('Hospitalización registrada exitosamente')
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al registrar la hospitalización')
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>Nueva Hospitalización</DrawerTitle>
          <DrawerDescription>
            Registra una nueva hospitalización para la mascota
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <HospitalizationForm />
            </form>
          </FormProvider>
        </div>

        <DrawerFooter>
          <ResponsiveButton
            type="submit"
            isLoading={createHospitalization.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            Registrar Hospitalización
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