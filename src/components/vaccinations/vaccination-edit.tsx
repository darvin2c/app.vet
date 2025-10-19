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
import { useVaccinationUpdate } from '@/hooks/vaccinations/use-vaccination-update'
import { Tables } from '@/types/supabase.types'

interface VaccinationEditProps {
  vaccination: Tables<'vaccinations'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VaccinationEdit({
  vaccination,
  open,
  onOpenChange,
}: VaccinationEditProps) {
  const updateVaccination = useVaccinationUpdate()

  const form = useForm<VaccinationFormData>({
    resolver: zodResolver(VaccinationSchema),
    defaultValues: {
      adverse_event: vaccination.adverse_event || '',
      dose: vaccination.dose || '',
      next_due_at: vaccination.next_due_at || '',
      route: vaccination.route || '',
      site: vaccination.site || '',
      clinical_record_id: vaccination.clinical_record_id,
    },
  })

  const onSubmit = async (data: VaccinationFormData) => {
    try {
      await updateVaccination.mutateAsync({
        id: vaccination.id,
        data: {
          ...data,
          adverse_event: data.adverse_event || null,
          dose: data.dose || null,
          next_due_at: data.next_due_at || null,
          route: data.route || null,
          site: data.site || null,
        },
      })
      toast.success('Vacunación actualizada exitosamente')
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al actualizar la vacunación')
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar Vacunación</DrawerTitle>
          <DrawerDescription>
            Modifica los datos de la vacunación
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
              isLoading={updateVaccination.isPending}
              className="flex-1"
            >
              Actualizar Vacunación
            </ResponsiveButton>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
