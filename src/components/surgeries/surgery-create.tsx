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
import { SurgeryForm } from './surgery-form'
import { SurgerySchema, SurgeryFormData } from '@/schemas/surgeries.schema'
import { useSurgeryCreate } from '@/hooks/surgeries/use-surgery-create'

interface SurgeryCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  petId: string
}

export function SurgeryCreate({
  open,
  onOpenChange,
  petId,
}: SurgeryCreateProps) {
  const createSurgery = useSurgeryCreate()

  const onSuccess = () => {
    toast.success('Cirugía creada exitosamente')
    onOpenChange(false)
    form.reset()
  }

  const form = useForm<SurgeryFormData>({
    resolver: zodResolver(SurgerySchema),
    defaultValues: {
      treatment_id: '',
      duration_min: undefined,
      surgeon_notes: '',
      complications: '',
    },
  })

  const onSubmit = async (data: SurgeryFormData) => {
    try {
      const surgeryData = {
        ...data,
        surgeon_notes: data.surgeon_notes || null,
        complications: data.complications || null,
      }
      await createSurgery.mutateAsync(surgeryData)
      onSuccess?.()
    } catch (error) {
      console.error('Error creating surgery:', error)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Nueva Cirugía</DrawerTitle>
          <DrawerDescription>
            Registra una nueva cirugía para la mascota
          </DrawerDescription>
        </DrawerHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
            <SurgeryForm />
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
              isLoading={createSurgery.isPending}
              className="flex-1"
            >
              Crear Cirugía
            </ResponsiveButton>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
