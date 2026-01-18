'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { FormSheet } from '@/components/ui/form-sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { HospitalizationForm } from './hospitalization-form'
import { useCreateHospitalization } from '@/hooks/hospitalizations/use-hospitalization-create'
import {
  hospitalizationCreateSchema,
  HospitalizationCreateSchema,
} from '@/schemas/hospitalization.schema'
import CanAccess from '@/components/ui/can-access'

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
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Nueva Hospitalización"
        description="Registra una nueva hospitalización para la mascota"
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={createHospitalization.isPending}
        submitLabel="Registrar Hospitalización"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <div className="px-4">
          <HospitalizationForm />
          <ResponsiveButton type="submit" className="sr-only">
            Registrar Hospitalización
          </ResponsiveButton>
        </div>
      </FormSheet>
    </CanAccess>
  )
}
