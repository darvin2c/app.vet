'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import useProductUpdate from '@/hooks/products/use-product-update'
import { serviceUpdateSchema } from '@/schemas/services.schema'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Tables } from '@/types/supabase.types'
import { Field } from '@/components/ui/field'
import { ServiceForm } from './service-form'
import { Form } from '@/components/ui/form'
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
      brand_id: service.brand_id || undefined,
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={`!w-full !max-w-4xl`} side="right">
        <ScrollArea className="h-full">
          <CanAccess resource="products" action="update">
            <SheetHeader>
              <SheetTitle>Editar Servicio</SheetTitle>
              <SheetDescription>
                Modifica la información del servicio.
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 min-h-0">
              <div className="px-4">
                <Form {...form}>
                  <form onSubmit={onSubmit} className="space-y-4">
                    <ServiceForm mode="edit" />
                  </form>
                </Form>
              </div>
            </div>

            <SheetFooter>
              <Field orientation="horizontal">
                <Button
                  type="submit"
                  onClick={onSubmit}
                  disabled={updateProduct.isPending}
                >
                  {updateProduct.isPending
                    ? 'Actualizando...'
                    : 'Actualizar Servicio'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={updateProduct.isPending}
                >
                  Cancelar
                </Button>
              </Field>
            </SheetFooter>
          </CanAccess>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
