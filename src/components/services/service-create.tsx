'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { ServiceForm } from './service-form'
import useProductCreate from '@/hooks/products/use-product-create'
import { serviceCreateSchema } from '@/schemas/services.schema'
import CanAccess from '@/components/ui/can-access'

interface ServiceCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ServiceCreate({ open, onOpenChange }: ServiceCreateProps) {
  const createProduct = useProductCreate()

  const form = useForm({
    resolver: zodResolver(serviceCreateSchema),
    defaultValues: {
      name: '',
      sku: undefined,
      barcode: undefined,
      category_id: undefined,
      is_active: true,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await createProduct.mutateAsync({ ...data, is_service: true } as any)
    form.reset()
    onOpenChange(false)
  })

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Crear Servicio"
        description="Completa la información para agregar un nuevo servicio."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={createProduct.isPending}
        submitLabel="Crear Servicio"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <ServiceForm mode="create" />
      </FormSheet>
    </CanAccess>
  )
}
