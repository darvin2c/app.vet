'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { FormSheet } from '@/components/ui/form-sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { VaccinationForm } from './vaccination-form'
import {
  VaccinationSchema,
  type VaccinationFormData,
} from '@/schemas/vaccinations.schema'
import { useVaccinationCreate } from '@/hooks/vaccinations/use-vaccination-create'
import CanAccess from '@/components/ui/can-access'
import { Form } from '@/components/ui/form'

interface VaccinationCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicalRecordId: string
  petId: string
}

export function VaccinationCreate({
  open,
  onOpenChange,
  medicalRecordId,
  petId,
}: VaccinationCreateProps) {
  const createVaccination = useVaccinationCreate()

  const form = useForm<VaccinationFormData>({
    resolver: zodResolver(VaccinationSchema) as any,
    defaultValues: {
      clinical_record_id: medicalRecordId,
      product_id: '',
      dose: '',
      route: '',
      site: '',
      next_due_at: undefined,
      adverse_event: '',
    },
  })

  const onSubmit = async (formData: VaccinationFormData) => {
    try {
      await createVaccination.mutateAsync({
        ...formData,
        clinical_record_id: medicalRecordId,
      })
      toast.success('Vacunación registrada exitosamente')
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error al registrar vacunación:', error)
      toast.error('Error al registrar la vacunación')
    }
  }

  return (
    <CanAccess resource="clinical_records" action="update">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Registrar Vacunación"
        description="Agregue los detalles de la vacunación"
        form={form}
        onSubmit={onSubmit}
        isPending={createVaccination.isPending}
        submitLabel="Guardar Vacunación"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <VaccinationForm />
      </FormSheet>
    </CanAccess>
  )
}
