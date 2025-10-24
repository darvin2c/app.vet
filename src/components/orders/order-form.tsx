'use client'

import { useFormContext } from 'react-hook-form'
import { CreateOrderSchema } from '@/schemas/orders.schema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CustomerSelect } from '@/components/customers/customer-select'
import { PetSelect } from '@/components/pets/pet-select'
import { Tables, Enums } from '@/types/supabase.types'
import { orderStatusOptions } from '@/schemas/orders.schema'

interface OrderFormProps {
  mode?: 'create' | 'edit'
  order?: Tables<'orders'>
}

export function OrderForm({ mode = 'create', order }: OrderFormProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CreateOrderSchema>()

  const selectedCustomerId = watch('custumer_id')
  const selectedPetId = watch('pet_id')

  return (
    <div className="space-y-6">
      {/* Información básica */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información básica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="order_number">Número de orden</FieldLabel>
            <FieldContent>
              <Input
                id="order_number"
                placeholder="Se generará automáticamente"
                {...register('order_number')}
              />
              <FieldError errors={[errors.order_number]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="status">Estado *</FieldLabel>
            <FieldContent>
              <Select
                value={watch('status') || ''}
                onValueChange={(value) =>
                  setValue('status', value as Enums<'order_status'>)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado..." />
                </SelectTrigger>
                <SelectContent>
                  {orderStatusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-1">
                        {status.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.status]} />
            </FieldContent>
          </Field>
        </div>
      </div>

      {/* Cliente y mascota */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Cliente y mascota</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="custumer_id">Cliente *</FieldLabel>
            <FieldContent>
              <CustomerSelect
                value={watch('custumer_id') || ''}
                onValueChange={(value) => {
                  setValue('custumer_id', value)
                  // Limpiar mascota cuando cambie el cliente
                  setValue('pet_id', '')
                }}
                placeholder="Seleccionar cliente..."
              />
              <FieldError errors={[errors.custumer_id]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="pet_id">Mascota</FieldLabel>
            <FieldContent>
              <PetSelect
                customerId={selectedCustomerId}
                value={watch('pet_id') || ''}
                onValueChange={(value) => setValue('pet_id', value)}
                placeholder="Seleccionar mascota..."
                disabled={!selectedCustomerId}
              />
              <FieldError errors={[errors.pet_id]} />
            </FieldContent>
          </Field>
        </div>
      </div>

      {/* Montos */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Montos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="currency">Moneda *</FieldLabel>
            <FieldContent>
              <Select
                value={watch('currency') || 'PEN'}
                onValueChange={(value) => setValue('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar moneda..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PEN">PEN - Sol Peruano</SelectItem>
                  <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[errors.currency]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="paid_amount">Monto pagado</FieldLabel>
            <FieldContent>
              <Input
                id="paid_amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('paid_amount', {
                  setValueAs: (value) => (value ? parseFloat(value) : 0),
                })}
              />
              <FieldError errors={[errors.paid_amount]} />
            </FieldContent>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field>
            <FieldLabel htmlFor="subtotal">Subtotal</FieldLabel>
            <FieldContent>
              <Input
                id="subtotal"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                readOnly
                className="bg-muted"
                {...register('subtotal', {
                  setValueAs: (value) => (value ? parseFloat(value) : 0),
                })}
              />
              <FieldError errors={[errors.subtotal]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="tax">Impuestos</FieldLabel>
            <FieldContent>
              <Input
                id="tax"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                readOnly
                className="bg-muted"
                {...register('tax', {
                  setValueAs: (value) => (value ? parseFloat(value) : 0),
                })}
              />
              <FieldError errors={[errors.tax]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="total">Total</FieldLabel>
            <FieldContent>
              <Input
                id="total"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                readOnly
                className="bg-muted font-semibold"
                {...register('total', {
                  setValueAs: (value) => (value ? parseFloat(value) : 0),
                })}
              />
              <FieldError errors={[errors.total]} />
            </FieldContent>
          </Field>
        </div>
      </div>

      {/* Notas */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notas adicionales</h3>
        <Field>
          <FieldLabel htmlFor="notes">Notas</FieldLabel>
          <FieldContent>
            <Textarea
              id="notes"
              placeholder="Notas adicionales sobre la orden..."
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
