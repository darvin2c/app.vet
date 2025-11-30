'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { IsActiveFormField } from '@/components/ui/is-active-field'
import { ProductCategorySelect } from '@/components/product-categories/product-category-select'
import { ProductBrandSelect } from '@/components/product-brands/product-brand-select'
import { Tables } from '@/types/supabase.types'

interface ServiceFormProps {
  mode?: 'create' | 'edit'
  service?: Tables<'products'>
}

export function ServiceForm({ mode = 'create', service }: ServiceFormProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext()

  return (
    <div className="space-y-6">
      {/* Información básica */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información básica</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field>
            <FieldLabel htmlFor="name">Nombre *</FieldLabel>
            <FieldContent>
              <Input
                id="name"
                placeholder="Ingresa el nombre del servicio"
                {...register('name')}
              />
              <FieldError errors={[errors.name]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="sku">SKU</FieldLabel>
            <FieldContent>
              <Input
                id="sku"
                placeholder="Código del servicio"
                {...register('sku')}
              />
              <FieldError errors={[errors.sku]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="barcode">Código de Barras</FieldLabel>
            <FieldContent>
              <Input
                id="barcode"
                placeholder="Código de barras"
                {...register('barcode')}
              />
              <FieldError errors={[errors.barcode]} />
            </FieldContent>
          </Field>
        </div>
      </div>

      {/* Categorización */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Categorización</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="category_id">Categoría</FieldLabel>
            <FieldContent>
              <ProductCategorySelect
                value={watch('category_id') || ''}
                onValueChange={(value) => setValue('category_id', value)}
                placeholder="Seleccionar categoría..."
              />
              <FieldError errors={[errors.category_id]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="brand_id">Marca</FieldLabel>
            <FieldContent>
              <ProductBrandSelect
                value={watch('brand_id') || ''}
                onValueChange={(value) => setValue('brand_id', value)}
                placeholder="Seleccionar marca..."
              />
              <FieldError errors={[errors.brand_id]} />
            </FieldContent>
          </Field>
        </div>
      </div>

      {/* Precios y costos */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Precios y costos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="price">Precio de venta *</FieldLabel>
            <FieldContent>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('price', {
                  setValueAs: (value) => (value ? parseFloat(value) : 0),
                })}
              />
              <FieldError errors={[errors.price]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="cost">Costo</FieldLabel>
            <FieldContent>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('cost', {
                  setValueAs: (value) =>
                    value ? parseFloat(value) : undefined,
                })}
              />
              <FieldError errors={[errors.cost]} />
            </FieldContent>
          </Field>
        </div>
      </div>

      {/* Configuración y notas */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Configuración</h3>

        {/* Fila horizontal para estado activo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IsActiveFormField />
        </div>

        {/* Fila separada para notas con ancho completo */}
        <Field>
          <FieldLabel htmlFor="notes">Notas</FieldLabel>
          <FieldContent>
            <Textarea
              id="notes"
              placeholder="Notas adicionales sobre el servicio..."
              className="min-h-[100px]"
              {...register('notes')}
            />
            <FieldError errors={[errors.notes]} />
          </FieldContent>
        </Field>
      </div>
    </div>
  )
}
