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
import { ScrollArea } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ProductForm } from './product-form'
import {
  UpdateProductSchema,
  updateProductSchema,
} from '@/schemas/products.schema'
import useUpdateProduct from '@/hooks/products/use-product-update'
import { Tables } from '@/types/supabase.types'
import { Field } from '../ui/field'

interface ProductEditProps {
  product: Tables<'products'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductEdit({ product, open, onOpenChange }: ProductEditProps) {
  const updateProduct = useUpdateProduct()

  const form = useForm({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku ?? undefined,
      category_id: product.category_id ?? undefined,
      unit_id: product.unit_id ?? undefined,
      is_active: product.is_active,
    },
  })

  const onSubmit = async (data: UpdateProductSchema) => {
    const formattedData = {
      ...data,
      expiry_date: data.expiry_date
        ? data.expiry_date.toISOString()
        : undefined,
    }
    await updateProduct.mutateAsync({
      id: product.id,
      data: formattedData,
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={`!w-full !max-w-4xl`} side="right">
        <ScrollArea className="h-full">
          <SheetHeader>
            <SheetTitle>Editar Producto</SheetTitle>
            <SheetDescription>
              Modifica la información del producto.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 min-h-0">
            <div className="px-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit as any)}
                  className="space-y-4"
                >
                  <ProductForm mode="edit" product={product} />
                </form>
              </Form>
            </div>
          </div>

          <SheetFooter>
            <Field orientation="horizontal">
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit as any)}
                disabled={updateProduct.isPending}
              >
                {updateProduct.isPending
                  ? 'Actualizando...'
                  : 'Actualizar Producto'}
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
