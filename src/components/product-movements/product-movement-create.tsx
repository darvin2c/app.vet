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
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ProductMovementForm } from './product-movement-form'
import {
  CreateProductMovementSchema,
  CreateProductMovementData,
} from '@/schemas/product-movements.schema'
import useProductMovementCreate from '@/hooks/product-movements/use-product-movement-create'
import { ScrollArea } from '../ui/scroll-area'

interface ProductMovementCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId?: string
}

export function ProductMovementCreate({
  open,
  onOpenChange,
  productId,
}: ProductMovementCreateProps) {
  const createProductMovement = useProductMovementCreate()

  const form = useForm({
    resolver: zodResolver(CreateProductMovementSchema),
    defaultValues: {
      product_id: productId,
      quantity: 0,
      unit_cost: null,
      note: null,
      reference: null,
    },
  })

  const onSubmit = async (data: CreateProductMovementData) => {
    await createProductMovement.mutateAsync(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full !max-w-2xl">
        <SheetHeader>
          <SheetTitle>Crear Movimiento de Producto</SheetTitle>
          <SheetDescription>
            Completa la información para agregar un nuevo movimiento de
            producto.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <ProductMovementForm mode="create" productId={productId} />
            </form>
          </Form>
        </ScrollArea>

        <SheetFooter className="gap-2 flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createProductMovement.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={createProductMovement.isPending}
          >
            {createProductMovement.isPending
              ? 'Creando...'
              : 'Crear Movimiento'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
