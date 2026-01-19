'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
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
    <div className="space-y-8">
      <FieldSet>
        <FieldLegend>Identificación</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Nombre *</FieldLabel>
            <FieldContent>
              <Input
                id="name"
                placeholder="Ingresa el nombre del servicio"
                {...register('name')}
              />
              <FieldDescription>
                El nombre comercial del servicio.
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
                  placeholder="Código del servicio"
                  {...register('sku')}
                />
                <FieldDescription>
                  Código único de identificación.
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
                <FieldDescription>Código para escaneo rápido.</FieldDescription>
                <FieldError errors={[errors.barcode]} />
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
                  Agrupa el servicio para facilitar búsquedas.
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
                  Unidad de medida (ej. sesión, hora).
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
                <FieldDescription>
                  Costo operativo del servicio.
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
                placeholder="Notas adicionales sobre el servicio..."
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
