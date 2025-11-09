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
import useCreateProduct from '@/hooks/products/use-product-create'
import { Field } from '../ui/field'
import { productCreateSchema } from '@/schemas/products.schema'

interface ProductCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductCreate({ open, onOpenChange }: ProductCreateProps) {
  const createProduct = useCreateProduct()
  const isMobile = useIsMobile()

  const form = useForm({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: '',
      sku: undefined,
      category_id: undefined,
      unit_id: undefined,
      stock: undefined,
      is_active: true,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const formattedData = {
      ...data,
      expiry_date: data.expiry_date
        ? data.expiry_date.toISOString()
        : undefined,
    }
    await createProduct.mutateAsync(formattedData)
    form.reset()
    onOpenChange(false)
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={`!w-full !max-w-4xl`} side="right">
        <ScrollArea className="h-full">
          <SheetHeader>
            <SheetTitle>Crear Producto</SheetTitle>
            <SheetDescription>
              Completa la información para agregar un nuevo producto.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 min-h-0">
            <div className="px-4">
              <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-4">
                  <ProductForm mode="create" />
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
                {createProduct.isPending ? 'Creando...' : 'Crear Producto'}
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
