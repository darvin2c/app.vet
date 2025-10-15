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
import { TreatmentItemForm } from './treatment-item-form'
import {
  TreatmentItemSchema,
  TreatmentItemFormData,
} from '@/schemas/treatment-items.schema'
import { useTreatmentItemCreate } from '@/hooks/treatment-items/use-treatment-item-create'

interface TreatmentItemCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  treatmentId: string
}

export function TreatmentItemCreate({
  open,
  onOpenChange,
  treatmentId,
}: TreatmentItemCreateProps) {
  const createTreatmentItem = useTreatmentItemCreate()

  const form = useForm<TreatmentItemFormData>({
    resolver: zodResolver(TreatmentItemSchema),
    defaultValues: {
      treatment_id: treatmentId,
      product_id: '',
      qty: 1,
      unit_price: 0,
      notes: '',
    },
  })

  const onSubmit = async (data: TreatmentItemFormData) => {
    try {
      await createTreatmentItem.mutateAsync({
        ...data,
        treatment_id: treatmentId,
      })
      toast.success('Item de tratamiento agregado exitosamente')
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error('Error al agregar el item de tratamiento')
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Agregar Item de Tratamiento</DrawerTitle>
          <DrawerDescription>
            Agrega un nuevo item al tratamiento
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TreatmentItemForm />
            </form>
          </FormProvider>
        </div>

        <DrawerFooter>
          <ResponsiveButton
            type="button"
            isLoading={createTreatmentItem.isPending}
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
