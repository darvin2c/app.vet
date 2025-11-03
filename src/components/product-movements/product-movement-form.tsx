'use client'

import { useFormContext } from 'react-hook-form'
import { ProductMovementFormData } from '@/schemas/product-movements.schema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'

import { ProductSelect } from '@/components/products/product-select'
import { Tables } from '@/types/supabase.types'

type ProductMovement = Tables<'product_movements'>

export function ProductMovementForm({
  mode,
  productMovement,
}: {
  mode: 'create' | 'update'
  productMovement?: ProductMovement
}) {
  const form = useFormContext<ProductMovementFormData>()
  const {
    formState: { errors },
    watch,
    setValue,
  } = form

  // Observar la cantidad para determinar si es entrada o salida
  const quantity = watch('quantity')
  const isEntry = quantity >= 0

  return (
    <div className="space-y-4 p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="product_id">Producto *</FieldLabel>
          <FieldContent>
            <ProductSelect
              value={form.watch('product_id') || ''}
              onValueChange={(value) => setValue('product_id', value)}
              placeholder="Seleccionar producto..."
            />
            <FieldError errors={[errors.product_id]} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="quantity">
            Cantidad * {isEntry ? '(Entrada +)' : '(Salida -)'}
          </FieldLabel>
          <FieldContent>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...form.register('quantity', {
                valueAsNumber: true,
                setValueAs: (value) => (value === '' ? 0 : Number(value)),
              })}
            />
            <FieldError errors={[errors.quantity]} />
          </FieldContent>
        </Field>

        {/* Campo movement_date removido - no existe en el schema */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="unit_cost">Costo Unitario</FieldLabel>
          <FieldContent>
            <Input
              id="unit_cost"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...form.register('unit_cost', {
                valueAsNumber: true,
                setValueAs: (value) =>
                  value === '' || value === null ? null : Number(value),
              })}
            />
            <FieldError errors={[errors.unit_cost]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="reference">Referencia</FieldLabel>
        <FieldContent>
          <Input
            id="reference"
            placeholder="Número de factura, orden, etc."
            {...form.register('reference')}
          />
          <FieldError errors={[errors.reference]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="note">Notas</FieldLabel>
        <FieldContent>
          <Textarea
            id="note"
            placeholder="Observaciones adicionales..."
            className="resize-none"
            rows={3}
            {...form.register('note')}
          />
          <FieldError errors={[errors.note]} />
        </FieldContent>
      </Field>
    </div>
  )
}
