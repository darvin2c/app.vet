'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useEffect } from 'react'
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
import { useUpdateHospitalization } from '@/hooks/hospitalizations/use-hospitalization-update'
import {
  hospitalizationUpdateSchema,
  HospitalizationUpdateSchema,
} from '@/schemas/hospitalization.schema'
import { Tables } from '@/types/supabase.types'
import { format } from 'date-fns'

// Tipo para hospitalization (sin pet_id por ahora, se agregará después)
type Hospitalization = Tables<'hospitalizations'>

interface HospitalizationEditProps {
  hospitalization: Hospitalization | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HospitalizationEdit({
  open,
  onOpenChange,
  hospitalization,
}: HospitalizationEditProps) {
  const updateHospitalization = useUpdateHospitalization()

  const form = useForm<HospitalizationUpdateSchema>({
    resolver: zodResolver(hospitalizationUpdateSchema),
    defaultValues: {
      pet_id: '',
      admission_at: '',
      discharge_at: '',
      bed_id: '',
      daily_rate: undefined,
      notes: '',
    },
  })

  // Actualizar valores del formulario cuando cambie la hospitalización
  useEffect(() => {
    if (hospitalization) {
      form.reset({
        pet_id: '', // TODO: Agregar pet_id cuando esté disponible en la tabla
        admission_at: hospitalization.admission_at
          ? format(new Date(hospitalization.admission_at), "yyyy-MM-dd'T'HH:mm")
          : '',
        discharge_at: hospitalization.discharge_at
          ? format(new Date(hospitalization.discharge_at), "yyyy-MM-dd'T'HH:mm")
          : '',
        bed_id: hospitalization.bed_id || '',
        daily_rate: hospitalization.daily_rate || undefined,
        notes: hospitalization.notes || '',
      })
    }
  }, [hospitalization, form])

  const onSubmit = async (data: HospitalizationUpdateSchema) => {
    if (!hospitalization) return

    try {
      await updateHospitalization.mutateAsync({
        id: hospitalization.id,
        data,
      })
      toast.success('Hospitalización actualizada exitosamente')
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al actualizar la hospitalización')
    }
  }

  if (!hospitalization) return null

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>Editar Hospitalización</DrawerTitle>
          <DrawerDescription>
            Modifica los datos de la hospitalización
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
            isLoading={updateHospitalization.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            Actualizar Hospitalización
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
