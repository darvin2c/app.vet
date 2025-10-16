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
import { MedicalRecordForm } from './medical-record-form'
import { useMedicalRecordCreate } from '@/hooks/medical-records/use-medical-record-create'
import {
  MedicalRecordSchema,
  MedicalRecordFormData,
} from '@/schemas/medical-record.schema'

interface MedicalRecordCreateProps {
  petId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MedicalRecordCreate({
  petId,
  open,
  onOpenChange,
}: MedicalRecordCreateProps) {
  const createMedicalRecord = useMedicalRecordCreate()

  const form = useForm<MedicalRecordFormData>({
    resolver: zodResolver(MedicalRecordSchema),
    defaultValues: {
      pet_id: petId,
      type: 'vaccination',
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      vet_id: '',
      notes: '',
    },
  })

  const onSubmit = async (data: MedicalRecordFormData) => {
    try {
      await createMedicalRecord.mutateAsync({
        ...data,
        pet_id: petId || data.pet_id,
      })
      toast.success('Registro médico creado exitosamente')
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al crear el registro médico')
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Nuevo Registro Médico</DrawerTitle>
          <DrawerDescription>
            Registra un nuevo registro médico para la mascota
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <MedicalRecordForm />
            </form>
          </FormProvider>
        </div>

        <DrawerFooter>
          <ResponsiveButton
            type="submit"
            form="medical-record-create-form"
            isLoading={createMedicalRecord.isPending}
          >
            Registrar Registro Médico
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
