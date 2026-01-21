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
import {
  InputGroup,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'

import { ProductSelect } from '@/components/products/product-select'
import { Tables } from '@/types/supabase.types'

type ProductMovement = Tables<'product_movements'>

export function ProductMovementForm({
  mode,
  productId,
  productMovement,
  product,
}: {
  mode: 'create' | 'update'
  productId?: string
  productMovement?: ProductMovement
  product?: Tables<'products'>
}) {
  const form = useFormContext()
  const {
    formState: { errors },
    watch,
    setValue,
    register,
  } = form

  const quantity =
    mode === 'update' && productMovement
      ? productMovement.quantity
      : watch('quantity')

  const unitCost = watch('unit_cost')

  const isEntry = (quantity ?? 0) >= 0

  // Cálculos de proyección
  const currentStock = product?.stock ?? 0
  const currentCost = product?.cost ?? 0

  const inputQty = Number(quantity || 0)
  const inputCost = Number(unitCost || 0)

  const projectedStock = currentStock + inputQty

  let projectedCost = currentCost
  if (inputQty > 0 && inputCost > 0) {
    const totalValue = currentStock * currentCost + inputQty * inputCost
    const totalQty = currentStock + inputQty
    if (totalQty !== 0) {
      projectedCost = totalValue / totalQty
    } else {
      projectedCost = inputCost // Fallback if stock is 0
    }
  }

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
              {product && mode === 'create' ? (
                <InputGroup>
                  <InputGroupInput
                    id="quantity"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    disabled={false}
                    {...register('quantity', {
                      valueAsNumber: true,
                      setValueAs: (value) => (value === '' ? 0 : Number(value)),
                    })}
                  />
                  <InputGroupText title="Stock Estimado">
                    ➝ {projectedStock}
                  </InputGroupText>
                </InputGroup>
              ) : (
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
              )}

              <FieldDescription>
                Use valores positivos para entradas y negativos para salidas.
                {product && mode === 'create' && (
                  <span className="block mt-1 text-xs text-muted-foreground">
                    Stock actual: {currentStock}. Se calculará: {currentStock}{' '}
                    {inputQty >= 0 ? '+' : ''} {inputQty} = {projectedStock}
                  </span>
                )}
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
              {product && mode === 'create' ? (
                <InputGroup>
                  <InputGroupInput
                    id="unit_cost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    disabled={false}
                    {...register('unit_cost', {
                      setValueAs: (value) =>
                        value === '' || value === null ? null : Number(value),
                    })}
                  />
                  <InputGroupText
                    className={
                      projectedCost !== currentCost
                        ? 'text-blue-600 font-medium'
                        : ''
                    }
                    title="Nuevo Costo Promedio"
                  >
                    ➝ {projectedCost.toFixed(2)}
                  </InputGroupText>
                </InputGroup>
              ) : (
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
              )}

              <FieldDescription>
                El costo por unidad de este movimiento.
                {product &&
                  mode === 'create' &&
                  inputQty > 0 &&
                  inputCost > 0 && (
                    <span className="block mt-1 text-xs text-muted-foreground">
                      Costo promedio ponderado: ((Stock Actual * Costo Actual) +
                      (Cantidad * Costo Unitario)) / Total Stock
                    </span>
                  )}
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
