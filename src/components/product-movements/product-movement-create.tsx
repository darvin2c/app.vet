'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { Plus, Save } from 'lucide-react'
import { ProductMovementForm } from './product-movement-form'
import {
  CreateProductMovementSchema,
  CreateProductMovementData,
} from '@/schemas/product-movements.schema'
import useProductMovementCreate from '@/hooks/product-movements/use-product-movement-create'
import { ProductForm } from '../products/product-form'

interface ProductMovementCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductMovementCreate({
  open,
  onOpenChange,
}: ProductMovementCreateProps) {
  const createProductMovement = useProductMovementCreate()

  const form = useForm({
    resolver: zodResolver(CreateProductMovementSchema),
    defaultValues: {
      product_id: '',
      quantity: 0,
      unit_cost: 0,
      note: '',
      reference: '',
      source: '',
      related_id: '',
    },
  })

  const onSubmit = async (data: CreateProductMovementData) => {
    await createProductMovement.mutateAsync(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Crear Movimiento de Producto</DrawerTitle>
          <DrawerDescription>
            Completa la información para agregar un nuevo movimiento de
            producto.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <ProductMovementForm mode="create" />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={createProductMovement.isPending}
          >
            {createProductMovement.isPending
              ? 'Creando...'
              : 'Crear Movimiento de Producto'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createProductMovement.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
