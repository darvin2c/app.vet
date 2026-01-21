'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldGroup,
} from '@/components/ui/field'
import { IsActiveFormField } from '@/components/ui/is-active-field'
import { ProductCategorySelect } from '@/components/product-categories/product-category-select'
import { ProductUnitSelect } from '@/components/product-units/product-unit-select'
import { ProductBrandSelect } from '@/components/product-brands/product-brand-select'
import { Tables } from '@/types/supabase.types'
import { ProductStockInput } from './product-stock-input'
import { ProductCostInput } from './product-cost-input'
import { Input } from '../ui/input'

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
    control,
  } = useFormContext()

  return (
    <div className="space-y-8">
      <FieldSet>
        <FieldLegend>Identificación</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Nombre *</FieldLabel>
            <FieldContent>
              <Input
                id="name"
                placeholder="Ingresa el nombre del producto"
                {...register('name')}
              />{' '}
              <FieldDescription>
                El nombre comercial del producto o servicio.
              </FieldDescription>
              <FieldError errors={[errors.name]} />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="sku">SKU</FieldLabel>
              <FieldContent>
                <Input
                  id="sku"
                  placeholder="Código del producto"
                  {...register('sku')}
                />
                <FieldDescription>
                  Código único de identificación de inventario.
                </FieldDescription>
                <FieldError errors={[errors.sku]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="barcode">Código de barras</FieldLabel>
              <FieldContent>
                <Input
                  id="barcode"
                  placeholder="Código de barras"
                  {...register('barcode')}
                />
                <FieldDescription>
                  Código EAN/UPC escaneable del producto.
                </FieldDescription>
                <FieldError errors={[errors.barcode]} />
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
                <FieldDescription>
                  La marca o fabricante del producto.
                </FieldDescription>
                <FieldError errors={[errors.brand_id]} />
              </FieldContent>
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Clasificación</FieldLegend>
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="category_id">Categoría</FieldLabel>
              <FieldContent>
                <ProductCategorySelect
                  value={watch('category_id') || ''}
                  onValueChange={(value) => setValue('category_id', value)}
                  placeholder="Seleccionar categoría..."
                />
                <FieldDescription>
                  Agrupa el producto para facilitar búsquedas.
                </FieldDescription>
                <FieldError errors={[errors.category_id]} />
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
                <FieldDescription>
                  Unidad de medida (ej. unidad, caja, kg).
                </FieldDescription>
                <FieldError errors={[errors.unit_id]} />
              </FieldContent>
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Precios e Inventario</FieldLegend>
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="cost">Costo</FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name="cost"
                  render={({ field: { value, onChange } }) => (
                    <ProductCostInput
                      mode={mode}
                      value={value}
                      onChange={onChange}
                      product={product}
                    />
                  )}
                />
                <FieldDescription>
                  Costo de adquisición del producto (sin impuestos).
                </FieldDescription>
                <FieldError errors={[errors.cost]} />
              </FieldContent>
            </Field>

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
                <FieldDescription>
                  Precio final de venta al público.
                </FieldDescription>
                <FieldError errors={[errors.price]} />
              </FieldContent>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="stock">Stock</FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name="stock"
                  render={({ field: { value, onChange } }) => (
                    <ProductStockInput
                      mode={mode}
                      value={value}
                      onChange={onChange}
                      product={product}
                    />
                  )}
                />
                <FieldDescription>
                  Cantidad actual disponible. Para agregar stock, haz clic en el
                  botón.
                </FieldDescription>
              </FieldContent>
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Otros</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="notes">Notas</FieldLabel>
            <FieldContent>
              <Textarea
                id="notes"
                placeholder="Notas adicionales sobre el producto..."
                className="min-h-[80px]"
                {...register('notes')}
              />
              <FieldError errors={[errors.notes]} />
            </FieldContent>
          </Field>
          <div className="flex justify-end">
            <IsActiveFormField />
          </div>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}
