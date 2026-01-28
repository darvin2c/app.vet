'use client'

import { useFormContext, Controller } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { DiscountInput } from '@/components/ui/discount-input'
import { Textarea } from '@/components/ui/textarea'
import { MedicalRecordItemFormData } from '@/schemas/medical-record-items.schema'
import { ProductSelect } from '@/components/products/product-select'
import useProduct from '@/hooks/products/use-product'
import { useEffect } from 'react'

export function MedicalRecordItemForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useFormContext<MedicalRecordItemFormData>()

  const productId = watch('product_id')
  const { data: product } = useProduct(productId)

  useEffect(() => {
    if (product) {
      setValue('unit_price', product.price)
    }
  }, [product, setValue])

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="product_id">Producto</FieldLabel>
        <FieldContent>
          <ProductSelect
            value={watch('product_id')}
            onValueChange={(value) => setValue('product_id', value)}
            placeholder="Seleccionar producto..."
          />
          <FieldError errors={[errors.product_id]} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="qty">Cantidad</FieldLabel>
          <FieldContent>
            <Input
              id="qty"
              type="number"
              min="1"
              step="1"
              {...register('qty', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.qty]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="unit_price">Precio Unitario</FieldLabel>
          <FieldContent>
            <Input
              id="unit_price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Ej: 25.50"
              {...register('unit_price', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.unit_price]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="discount">Descuento</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="discount"
            render={({ field }) => (
              <DiscountInput
                id="discount"
                value={field.value || 0}
                onChange={field.onChange}
                totalAmount={watch('unit_price') || 0}
              />
            )}
          />
          <FieldError errors={[errors.discount]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="notes">Notas</FieldLabel>
        <FieldContent>
          <Textarea
            id="notes"
            placeholder="Notas adicionales sobre el item..."
            rows={3}
            {...register('notes')}
          />
          <FieldError errors={[errors.notes]} />
        </FieldContent>
      </Field>
    </div>
  )
}
