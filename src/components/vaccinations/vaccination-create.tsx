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
import { VaccinationForm } from './vaccination-form'
import {
  VaccinationSchema,
  type VaccinationFormData,
} from '@/schemas/vaccinations.schema'
import { useVaccinationCreate } from '@/hooks/vaccinations/use-vaccination-create'

interface VaccinationCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicalRecordId: string
}

export function VaccinationCreate({
  open,
  onOpenChange,
  medicalRecordId,
}: VaccinationCreateProps) {
  const createVaccination = useVaccinationCreate()

  const form = useForm<VaccinationFormData>({
    resolver: zodResolver(VaccinationSchema),
    defaultValues: {
      clinical_record_id: medicalRecordId,
      adverse_event: '',
      dose: '',
      next_due_at: '',
      route: '',
      site: '',
    },
  })

  const onSubmit = async (data: VaccinationFormData) => {
    try {
      await createVaccination.mutateAsync(data)
      toast.success('Vacunación creada exitosamente')
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error('Error al crear la vacunación')
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Nueva Vacunación</DrawerTitle>
          <DrawerDescription>
            Registra una nueva vacunación para el registro médico
          </DrawerDescription>
        </DrawerHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
            <VaccinationForm />
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
              isLoading={createVaccination.isPending}
              className="flex-1"
            >
              Crear Vacunación
            </ResponsiveButton>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
