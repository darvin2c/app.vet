'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Drawer } from '@/components/ui/drawer-form'
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ProductMovementForm />

          <DrawerFooter>
            <ResponsiveButton
              icon={Save}
              type="submit"
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
        </form>
      </Form>
    </Drawer>
  )
}
