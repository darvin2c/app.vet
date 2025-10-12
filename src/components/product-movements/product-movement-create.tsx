'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { Plus, Save } from 'lucide-react'
import { ProductMovementForm } from './product-movement-form'
import {
  CreateProductMovementSchema,
  CreateProductMovementData,
} from '@/schemas/product-movements.schema'
import useCreateProductMovement from '@/hooks/product-movements/use-create-product-movement'

interface ProductMovementCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductMovementCreate({
  open,
  onOpenChange,
}: ProductMovementCreateProps) {
  const createProductMovement = useCreateProductMovement()

  const form = useForm({
    resolver: zodResolver(CreateProductMovementSchema),
    defaultValues: {
      product_id: '',
      quantity: 0,
      movement_date: new Date(),
      unit_cost: 0,
      total_cost: 0,
      note: '',
      reference_type: '',
      reference_id: '',
    },
  })

  const onSubmit = async (data: CreateProductMovementData) => {
    try {
      await createProductMovement.mutateAsync(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      // El error ya se maneja en el hook con toast
      console.error('Error al crear movimiento:', error)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!right-0 !left-auto max-w-3xl">
        <DrawerHeader>
          <DrawerTitle>Crear Movimiento de Producto</DrawerTitle>
          <DrawerDescription>
            Registra un nuevo movimiento de inventario para el producto
            seleccionado.
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
            <ProductMovementForm />
          </form>
        </Form>

        <DrawerFooter>
          <ResponsiveButton
            icon={Save}
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            isLoading={createProductMovement.isPending}
            disabled={createProductMovement.isPending}
          >
            Crear Movimiento
          </ResponsiveButton>
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
