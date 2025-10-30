'use client'

import { useFormContext } from 'react-hook-form'
import { CreateProductSchema } from '@/schemas/products.schema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { IsActiveFormField } from '@/components/ui/is-active-field'
import { ProductCategorySelect } from '@/components/product-categories/product-category-select'
import { ProductUnitSelect } from '@/components/product-units/product-unit-select'
import { ProductBrandSelect } from '@/components/product-brands/product-brand-select'
import { DatePicker } from '@/components/ui/date-picker'
import { Tables } from '@/types/supabase.types'
import { ProductStockInput } from './product-stock-input'

interface ProductFormProps {
  mode?: 'create' | 'edit'
  product?: Tables<'products'>
}

export function ProductForm({ mode = 'create', product }: ProductFormProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CreateProductSchema>()

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
                placeholder="Ingresa el nombre del producto"
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
                placeholder="Código del producto"
                {...register('sku')}
              />
              <FieldError errors={[errors.sku]} />
            </FieldContent>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="barcode">Código de barras</FieldLabel>
            <FieldContent>
              <Input
                id="barcode"
                placeholder="Código de barras"
                {...register('barcode')}
              />
              <FieldError errors={[errors.barcode]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="batch_number">Número de lote</FieldLabel>
            <FieldContent>
              <Input
                id="batch_number"
                placeholder="Número de lote"
                {...register('batch_number')}
              />
              <FieldError errors={[errors.batch_number]} />
            </FieldContent>
          </Field>
        </div>
      </div>

      {/* Categorización */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Categorización</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <Field>
            <FieldLabel htmlFor="unit_id">Unidad</FieldLabel>
            <FieldContent>
              <ProductUnitSelect
                value={watch('unit_id') || ''}
                onValueChange={(value) => setValue('unit_id', value)}
                placeholder="Seleccionar unidad..."
              />
              <FieldError errors={[errors.unit_id]} />
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

      {/* Inventario y fechas */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Inventario y fechas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="stock">Inventario</FieldLabel>
            <FieldContent>
              <ProductStockInput mode={mode} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="expiry_date">Fecha de vencimiento</FieldLabel>
            <FieldContent>
              <DatePicker
                id="expiry_date"
                name="expiry_date"
                value={watch('expiry_date')}
                onChange={(value) =>
                  setValue('expiry_date', value?.toISOString())
                }
                hasTime={false}
                error={!!errors.expiry_date}
                errorMessage={errors.expiry_date?.message as string}
              />
              <FieldError errors={[errors.expiry_date]} />
            </FieldContent>
          </Field>
        </div>
      </div>

      {/* Configuración y notas */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Configuración</h3>

        {/* Fila horizontal para checkbox y estado activo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldContent className="flex flex-row items-start space-x-3 space-y-0">
              <Checkbox id="is_service" {...register('is_service')} />
              <div className="space-y-1 leading-none">
                <FieldLabel htmlFor="is_service">Es un servicio</FieldLabel>
                <p className="text-sm text-muted-foreground">
                  Marcar si este producto es un servicio (no requiere
                  inventario)
                </p>
              </div>
            </FieldContent>
            <FieldError errors={[errors.is_service]} />
          </Field>

          <IsActiveFormField />
        </div>

        {/* Fila separada para notas con ancho completo */}
        <Field>
          <FieldLabel htmlFor="notes">Notas</FieldLabel>
          <FieldContent>
            <Textarea
              id="notes"
              placeholder="Notas adicionales sobre el producto..."
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
