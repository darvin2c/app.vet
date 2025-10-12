'use client'

import { useFormContext } from 'react-hook-form'
import { CreateProductSchema } from '@/schemas/products.schema'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { IsActiveFormField } from '@/components/ui/is-active-field'
import { ProductCategorySelect } from '@/components/product-categories/product-category-select'
import { ProductUnitSelect } from '@/components/product-units/product-unit-select'
import { Tables } from '@/types/supabase.types'
import { ProductStockInput } from './product-stock-input'

interface ProductFormProps {
  mode?: 'create' | 'edit'
  product?: Tables<'products'>
}

export function ProductForm({ mode = 'create', product }: ProductFormProps) {
  const { control } = useFormContext<CreateProductSchema>()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingresa el nombre del producto"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input
                  placeholder="Código del producto"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <ProductCategorySelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  placeholder="Seleccionar categoría..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="unit_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidad</FormLabel>
              <FormControl>
                <ProductUnitSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  placeholder="Seleccionar unidad..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductStockInput mode={mode} />
        <IsActiveFormField />
      </div>
    </div>
  )
}
