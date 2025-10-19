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
import { MedicalRecordForm } from './medical-record-form'
import { useMedicalRecordUpdate } from '@/hooks/medical-records/use-medical-record-update'
import {
  MedicalRecordSchema,
  MedicalRecordFormData,
} from '@/schemas/medical-record.schema'
import { Tables } from '@/types/supabase.types'

interface MedicalRecordEditProps {
  medicalRecord: Tables<'clinical_records'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MedicalRecordEdit({
  medicalRecord,
  open,
  onOpenChange,
}: MedicalRecordEditProps) {
  const updateMedicalRecord = useMedicalRecordUpdate()

  const form = useForm<MedicalRecordFormData>({
    resolver: zodResolver(MedicalRecordSchema),
    defaultValues: {
      pet_id: medicalRecord.pet_id,
      record_type: medicalRecord.record_type,
      record_date: medicalRecord.record_date?.split('T')[0] || '',
      reason: medicalRecord.reason || '',
      diagnosis: medicalRecord.diagnosis || '',
      vet_id: medicalRecord.vet_id || '',
      notes: medicalRecord.notes || '',
    },
  })

  useEffect(() => {
    if (medicalRecord) {
      form.reset({
        pet_id: medicalRecord.pet_id,
        record_type: medicalRecord.record_type,
        record_date: medicalRecord.record_date?.split('T')[0] || '',
        reason: medicalRecord.reason || '',
        diagnosis: medicalRecord.diagnosis || '',
        vet_id: medicalRecord.vet_id || '',
        notes: medicalRecord.notes || '',
      })
    }
  }, [medicalRecord, form])

  const onSubmit = async (data: MedicalRecordFormData) => {
    try {
      await updateMedicalRecord.mutateAsync({
        id: medicalRecord.id,
        data,
      })
      toast.success('Registro médico actualizado exitosamente')
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al actualizar el registro médico')
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar Registro Médico</DrawerTitle>
          <DrawerDescription>
            Modifica la información del registro médico
          </DrawerDescription>
        </DrawerHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
            <MedicalRecordForm />
          </form>
        </FormProvider>

        <DrawerFooter>
          <ResponsiveButton
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            isLoading={updateMedicalRecord.isPending}
          >
            Actualizar Registro Médico
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
