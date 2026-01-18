'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FormSheet } from '@/components/ui/form-sheet'

import { ProductBrandForm } from './product-brand-form'
import useProductBrandCreate from '@/hooks/product-brands/use-product-brand-create'
import { productBrandCreateSchema } from '@/schemas/product-brands.schema'
import CanAccess from '@/components/ui/can-access'

interface ProductBrandCreateProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ProductBrandCreate({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ProductBrandCreateProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen
  const mutation = useProductBrandCreate()

  const form = useForm({
    resolver: zodResolver(productBrandCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync(data)
    form.reset()
    setOpen(false)
  })

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open as boolean}
        onOpenChange={setOpen as any}
        trigger={children as any}
        title="Crear Marca de Producto"
        description="Completa los datos para crear una nueva marca de producto."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={mutation.isPending}
        submitLabel="Crear Marca"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <div className="px-4">
          <ProductBrandForm />
        </div>
      </FormSheet>
    </CanAccess>
  )
}
