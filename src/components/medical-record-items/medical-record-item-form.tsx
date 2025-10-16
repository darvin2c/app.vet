'use client'

import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MedicalRecordItemFormData } from '@/schemas/medical-record-items.schema'

export function MedicalRecordItemForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<MedicalRecordItemFormData>()

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="product_id">Producto</FieldLabel>
        <FieldContent>
          <Input
            id="product_id"
            placeholder="Seleccionar producto..."
            {...register('product_id')}
          />
          <FieldError errors={[errors.product_id]} />
        </FieldContent>
      </Field>

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
