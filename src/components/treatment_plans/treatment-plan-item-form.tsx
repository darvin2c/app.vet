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
import { ProcedureSelect } from '@/components/procedures/procedure-select'

export function TreatmentPlanItemForm() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext()

  // Watch procedure selection to auto-fill unit price
  const selectedProcedureId = watch('procedure_id')
  const quantity = watch('quantity') || 1
  const unitPrice = watch('unit_price') || 0

  // Calculate total price automatically
  const totalPrice = quantity * unitPrice

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="procedure_id">Procedimiento *</FieldLabel>
        <FieldContent>
          <ProcedureSelect
            value={selectedProcedureId}
            onValueChange={(value) => {
              setValue('procedure_id', value)
            }}
            placeholder="Seleccionar procedimiento"
          />
          <FieldError errors={[errors.procedure_id]} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="quantity">Cantidad *</FieldLabel>
          <FieldContent>
            <Input
              id="quantity"
              type="number"
              min="1"
              step="1"
              {...register('quantity', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.quantity]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="unit_price">Precio Unitario *</FieldLabel>
          <FieldContent>
            <Input
              id="unit_price"
              type="number"
              min="0"
              step="0.01"
              {...register('unit_price', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.unit_price]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel>Precio Total</FieldLabel>
        <FieldContent>
          <Input
            value={`S/ ${totalPrice.toFixed(2)}`}
            disabled
            className="bg-muted"
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Notas</FieldLabel>
        <FieldContent>
          <Textarea
            id="description"
            placeholder="Notas adicionales sobre el procedimiento..."
            {...register('description')}
          />
          <FieldError errors={[errors.description]} />
        </FieldContent>
      </Field>
    </div>
  )
}
