'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import useProductUpdate from '@/hooks/products/use-product-update'
import { serviceUpdateSchema } from '@/schemas/services.schema'
import { Tables } from '@/types/supabase.types'
import { ServiceForm } from './service-form'
import CanAccess from '@/components/ui/can-access'

interface ServiceEditProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: Tables<'products'>
}

export function ServiceEdit({ open, onOpenChange, service }: ServiceEditProps) {
  const updateProduct = useProductUpdate()

  const form = useForm({
    resolver: zodResolver(serviceUpdateSchema),
    defaultValues: {
      name: service.name,
      sku: service.sku || undefined,
      category_id: service.category_id || undefined,
      unit_id: service.unit_id || undefined,
      is_active: service.is_active,
      price: service.price || undefined,
      cost: service.cost || undefined,
      barcode: service.barcode || undefined,
      notes: service.notes || undefined,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await updateProduct.mutateAsync({
      id: service.id,
      data: { ...data, is_service: true },
    })
    onOpenChange(false)
  })

  return (
    <CanAccess resource="products" action="update">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Editar Servicio"
        description="Modifica la información del servicio."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={updateProduct.isPending}
        submitLabel="Actualizar Servicio"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-4xl"
      >
        <ServiceForm mode="edit" />
      </FormSheet>
    </CanAccess>
  )
}
