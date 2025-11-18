'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Form } from '@/components/ui/form'

import { ProductBrandForm } from './product-brand-form'
import useProductBrandUpdate from '@/hooks/product-brands/use-product-brand-update'
import { Tables } from '@/types/supabase.types'
import { productBrandUpdateSchema } from '@/schemas/product-brands.schema'
import { ScrollArea } from '../ui/scroll-area'
import CanAccess from '@/components/ui/can-access'

interface ProductBrandEditProps {
  brand: Tables<'product_brands'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductBrandEdit({
  brand,
  open,
  onOpenChange,
}: ProductBrandEditProps) {
  const mutation = useProductBrandUpdate()

  const form = useForm({
    resolver: zodResolver(productBrandUpdateSchema),
    defaultValues: {
      name: brand.name,
      description: brand.description || '',
      is_active: brand.is_active,
    },
  })

  useEffect(() => {
    if (brand) {
      form.reset({
        name: brand.name,
        description: brand.description || '',
        is_active: brand.is_active,
      })
    }
  }, [brand, form])

  const onSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync({
      id: brand.id,
      ...data,
    })
    onOpenChange(false)
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full !max-w-2xl">
        <ScrollArea>
          <CanAccess resource="products" action="update">
            <SheetHeader>
              <SheetTitle>Editar Marca de Producto</SheetTitle>
              <SheetDescription>
                Modifica los datos de la marca de producto.
              </SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="px-4 overflow-y-auto">
                  <ProductBrandForm />
                </div>
                <SheetFooter className="flex-row">
                  <Button
                    type="submit"
                    onClick={onSubmit}
                    disabled={mutation.isPending}
                  >
                    Actualizar Marca
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={mutation.isPending}
                  >
                    Cancelar
                  </Button>
                </SheetFooter>
              </form>
            </Form>
          </CanAccess>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
