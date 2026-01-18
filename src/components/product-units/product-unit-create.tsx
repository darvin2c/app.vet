'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FormSheet } from '@/components/ui/form-sheet'

import { ProductUnitForm } from './product-unit-form'
import useProductUnitCreate from '@/hooks/product-units/use-product-unit-create'
import { productUnitCreateSchema } from '@/schemas/product-units.schema'
import CanAccess from '@/components/ui/can-access'

interface ProductUnitCreateProps {
  children?: React.ReactNode
  controlled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onUnitCreated?: (unit: any) => void
}

export function ProductUnitCreate({
  children,
  controlled = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onUnitCreated,
}: ProductUnitCreateProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const mutation = useProductUnitCreate()

  const open = controlled ? controlledOpen : internalOpen
  const onOpenChange = controlled ? controlledOnOpenChange : setInternalOpen

  const form = useForm({
    resolver: zodResolver(productUnitCreateSchema),
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const result = await mutation.mutateAsync(data)
    form.reset()
    onOpenChange?.(false)
    onUnitCreated?.(result)
  })

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open as boolean}
        onOpenChange={onOpenChange as any}
        trigger={!controlled ? (children as any) : undefined}
        title="Crear Unidad de Producto"
        description="Completa los datos para crear una nueva unidad de producto."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={mutation.isPending}
        submitLabel="Crear Unidad"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-4xl"
      >
        <ProductUnitForm />
      </FormSheet>
    </CanAccess>
  )
}
