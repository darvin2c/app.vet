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
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ServiceForm } from './service-form'
import useProductCreate from '@/hooks/products/use-product-create'
import { Field } from '@/components/ui/field'
import { serviceCreateSchema } from '@/schemas/services.schema'
import CanAccess from '@/components/ui/can-access'

interface ServiceCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ServiceCreate({ open, onOpenChange }: ServiceCreateProps) {
  const createProduct = useProductCreate()
  const isMobile = useIsMobile()

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={`!w-full !max-w-4xl ${isMobile ? 'max-h-[85vh]' : ''}`}
        side={isMobile ? 'bottom' : 'right'}
      >
        <CanAccess resource="products" action="create">
          <SheetHeader>
            <SheetTitle>Crear Servicio</SheetTitle>
            <SheetDescription>
              Completa la información para agregar un nuevo servicio.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 min-h-0">
            <div className="px-4">
              <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-4">
                  <ServiceForm mode="create" />
                </form>
              </Form>
            </div>
          </div>

          <SheetFooter>
            <Field orientation="horizontal">
              <Button
                type="submit"
                onClick={onSubmit}
                disabled={createProduct.isPending}
              >
                {createProduct.isPending ? 'Creando...' : 'Crear Servicio'}
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createProduct.isPending}
              >
                Cancelar
              </Button>
            </Field>
          </SheetFooter>
        </CanAccess>
      </SheetContent>
    </Sheet>
  )
}
