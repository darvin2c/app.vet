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
import { MedicalRecordItemForm } from './medical-record-item-form'
import {
  MedicalRecordItemSchema,
  MedicalRecordItemFormData,
} from '@/schemas/medical-record-items.schema'
import { useMedicalRecordItemCreate } from '@/hooks/medical-record-items/use-medical-record-item-create'

interface MedicalRecordItemCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicalRecordId: string
}

export function MedicalRecordItemCreate({
  open,
  onOpenChange,
  medicalRecordId,
}: MedicalRecordItemCreateProps) {
  const createMedicalRecordItem = useMedicalRecordItemCreate()

  const form = useForm<MedicalRecordItemFormData>({
    resolver: zodResolver(MedicalRecordItemSchema),
    defaultValues: {
      medical_record_id: medicalRecordId,
      product_id: '',
      qty: 1,
      unit_price: 0,
      notes: '',
    },
  })

  const onSubmit = async (data: MedicalRecordItemFormData) => {
    try {
      await createMedicalRecordItem.mutateAsync({
        ...data,
        medical_record_id: medicalRecordId,
      })
      toast.success('Item de registro médico agregado exitosamente')
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error('Error al agregar el item de registro médico')
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Agregar Item de Registro Médico</DrawerTitle>
          <DrawerDescription>
            Agrega un nuevo item al registro médico
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <MedicalRecordItemForm />
            </form>
          </FormProvider>
        </div>

        <DrawerFooter>
          <ResponsiveButton
            type="button"
            isLoading={createMedicalRecordItem.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            Agregar Item
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
