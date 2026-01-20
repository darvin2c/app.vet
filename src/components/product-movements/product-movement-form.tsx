'use client'

import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldGroup,
  FieldDescription,
} from '@/components/ui/field'

import { ProductSelect } from '@/components/products/product-select'
import { Tables } from '@/types/supabase.types'

type ProductMovement = Tables<'product_movements'>

export function ProductMovementForm({
  mode,
  productId,
  productMovement,
}: {
  mode: 'create' | 'update'
  productId?: string
  productMovement?: ProductMovement
}) {
  const form = useFormContext()
  const {
    formState: { errors },
    watch,
    setValue,
    register,
  } = form

  // Observar la cantidad para determinar si es entrada o salida
  const quantity =
    mode === 'update' && productMovement
      ? productMovement.quantity
      : watch('quantity')
  const isEntry = (quantity ?? 0) >= 0

  // Sincronizar el valor del formulario cuando se pasa productId (modo create)
  useEffect(() => {
    if (productId) {
      setValue('product_id', productId)
    }
  }, [productId, setValue])

  const selectValue =
    mode === 'update' && productMovement
      ? productMovement.product_id
      : (productId ?? watch('product_id') ?? '')

  return (
    <div className="space-y-8">
      <FieldSet>
        <FieldLegend>Detalles del Movimiento</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="product_id">Producto *</FieldLabel>
            <FieldContent>
              <ProductSelect
                value={selectValue}
                onValueChange={(value) => setValue('product_id', value)}
                placeholder="Seleccionar producto..."
                disabled={mode === 'update' || !!productId}
              />
              <FieldDescription>
                El producto al que se aplicará el movimiento.
              </FieldDescription>
              <FieldError errors={[errors.product_id]} />
            </FieldContent>
          </Field>

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
                disabled={mode === 'update'}
                value={
                  mode === 'update' && productMovement
                    ? productMovement.quantity
                    : undefined
                }
                {...register('quantity', {
                  valueAsNumber: true,
                  setValueAs: (value) => (value === '' ? 0 : Number(value)),
                })}
              />
              <FieldDescription>
                Use valores positivos para entradas y negativos para salidas.
              </FieldDescription>
              <FieldError errors={[errors.quantity]} />
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Información Financiera</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="unit_cost">Costo Unitario</FieldLabel>
            <FieldContent>
              <Input
                id="unit_cost"
                type="number"
                step="0.01"
                placeholder="0.00"
                disabled={mode === 'update'}
                value={
                  mode === 'update' && productMovement
                    ? (productMovement.unit_cost ?? '')
                    : undefined
                }
                {...register('unit_cost', {
                  setValueAs: (value) =>
                    value === '' || value === null ? null : Number(value),
                })}
              />
              <FieldDescription>
                El costo por unidad de este movimiento.
              </FieldDescription>
              <FieldError errors={[errors.unit_cost]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="reference">Referencia</FieldLabel>
            <FieldContent>
              <Input
                id="reference"
                placeholder="Número de factura, orden, etc."
                {...register('reference')}
              />
              <FieldDescription>
                Documento de respaldo del movimiento.
              </FieldDescription>
              <FieldError errors={[errors.reference]} />
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Otros</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="note">Notas</FieldLabel>
            <FieldContent>
              <Textarea
                id="note"
                placeholder="Observaciones adicionales..."
                className="min-h-[80px]"
                rows={3}
                {...register('note')}
              />
              <FieldDescription>
                Cualquier detalle adicional sobre este movimiento.
              </FieldDescription>
              <FieldError errors={[errors.note]} />
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}
